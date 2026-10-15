"""Exercise the published artifacts, not just the builder's implementation."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import stat
import subprocess
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("downloads", ROOT / "scripts/build_downloads.py")
downloads = importlib.util.module_from_spec(spec)
spec.loader.exec_module(downloads)


class DownloadsTest(unittest.TestCase):
    def test_every_published_file_matches_source_browse_zip_and_manifest(self):
        destination = ROOT / "docs/packs"
        expected_artifacts = set()
        for source, prefix, name in downloads.PACKAGES:
            source = ROOT / source
            browse = ROOT / ("docs/examples/array-limit" if name == "worked-example" else f"docs/packs/{prefix}")
            files = {p.relative_to(source).as_posix(): p.read_bytes() for p in source.rglob("*") if p.is_file()}
            browsed = {p.relative_to(browse).as_posix(): p.read_bytes() for p in browse.rglob("*") if p.is_file()}
            self.assertEqual(files, browsed, f"Source/browse mismatch: {name}")
            manifest = json.loads((destination / f"{name}-manifest.json").read_text())
            self.assertEqual(manifest["root"], prefix)
            self.assertEqual(manifest["archive"], f"{name}.zip")
            self.assertEqual([entry["path"] for entry in manifest["files"]], sorted(files))
            with zipfile.ZipFile(destination / f"{name}.zip") as archive:
                self.assertEqual(archive.namelist(), [f"{prefix}/{path}" for path in sorted(files)])
                for entry in manifest["files"]:
                    data = files[entry["path"]]
                    self.assertEqual(archive.read(f"{prefix}/{entry['path']}"), data)
                    self.assertEqual(entry["bytes"], len(data))
                    self.assertEqual(entry["sha256"], hashlib.sha256(data).hexdigest())
            expected_artifacts.update((f"{name}.zip", f"{name}-manifest.json"))
        listed = {}
        for line in (destination / "SHA256SUMS").read_text().splitlines():
            checksum, name = line.split("  ")
            self.assertNotIn(name, listed)
            listed[name] = checksum
            self.assertEqual(checksum, hashlib.sha256((destination / name).read_bytes()).hexdigest())
        self.assertEqual(set(listed), expected_artifacts)

    def test_reproducible_despite_mtimes_modes_and_creation_order(self):
        # Rebuild every real package twice with different filesystem metadata/order.
        with tempfile.TemporaryDirectory() as temp:
            temp = Path(temp)
            for source, prefix, name in downloads.PACKAGES:
                files = sorted(p for p in (ROOT / source).rglob("*") if p.is_file())
                outputs = []
                for variant in range(2):
                    tree = temp / name / str(variant) / "source"
                    for path in files if variant == 0 else reversed(files):
                        target = tree / path.relative_to(ROOT / source)
                        target.parent.mkdir(parents=True, exist_ok=True)
                        target.write_bytes(path.read_bytes())
                        target.chmod(0o600 if variant == 0 else 0o755)
                        os.utime(target, (946684800 + variant * 100000000, 946684800 + variant * 100000000))
                    output = temp / name / str(variant) / "out"
                    artifacts = downloads.build_package(tree, prefix, name, output)
                    outputs.append([p.read_bytes() for p in artifacts])
                    with zipfile.ZipFile(artifacts[0]) as archive:
                        for entry in archive.infolist():
                            self.assertEqual(entry.date_time, (1980, 1, 1, 0, 0, 0))
                            self.assertEqual(stat.S_IMODE(entry.external_attr >> 16), 0o644)
                            self.assertEqual(entry.compress_type, zipfile.ZIP_STORED)
                self.assertEqual(outputs[0], outputs[1], name)
                self.assertEqual(outputs[0][0], (ROOT / f"docs/packs/{name}.zip").read_bytes())
                self.assertEqual(outputs[0][1], (ROOT / f"docs/packs/{name}-manifest.json").read_bytes())

    def test_downloaded_exercise_reproduces_both_failures_and_the_fix(self):
        with tempfile.TemporaryDirectory() as temp:
            with zipfile.ZipFile(ROOT / "docs/packs/worked-example.zip") as archive:
                archive.extractall(temp)
            for stage, passes, failures in (("buggy", 5, 1), ("attempt", 5, 1), ("fixed", 6, 0)):
                result = subprocess.run(
                    ["node", "--test-reporter=tap", "test.cjs", stage],
                    cwd=Path(temp) / "worked-example", capture_output=True, text=True,
                    timeout=15,
                )
                self.assertEqual(result.returncode, 1 if failures else 0, result.stdout + result.stderr)
                self.assertIn("# tests 6", result.stdout)
                self.assertIn(f"# pass {passes}", result.stdout)
                self.assertIn(f"# fail {failures}", result.stdout)
                if failures:
                    self.assertIn("not ok 3 - zero requests no items", result.stdout)


if __name__ == "__main__":
    unittest.main()
