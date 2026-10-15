#!/usr/bin/env python3
"""Build byte-reproducible public downloads from source; no host metadata."""
import hashlib
import json
from pathlib import Path
import stat
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PACKAGES = (
    ("packs/codex-hour", "codex-hour", "codex-hour-starter"),
    ("packs/cursor-hour", "cursor-hour", "cursor-hour-starter"),
    ("examples/array-limit", "worked-example", "worked-example"),
)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def build_package(source, prefix, name, destination):
    """Manifest is adjacent to the ZIP, never part of its own hash input."""
    source, destination = Path(source), Path(destination)
    destination.mkdir(parents=True, exist_ok=True)
    files = sorted((p for p in source.rglob("*") if p.is_file()),
                   key=lambda p: p.relative_to(source).as_posix())
    if not files:
        raise ValueError(f"Empty download source: {source}")
    if any(p.is_symlink() for p in source.rglob("*")):
        raise ValueError(f"Symlinks are not supported: {source}")
    entries = []
    archive_path = destination / f"{name}.zip"
    # STORE avoids zlib-version differences. These small text packs need no compression.
    with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_STORED) as archive:
        for path in files:
            relative = path.relative_to(source).as_posix()
            data = path.read_bytes()
            info = zipfile.ZipInfo(f"{prefix}/{relative}", (1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = (stat.S_IFREG | 0o644) << 16
            info.compress_type = zipfile.ZIP_STORED
            archive.writestr(info, data)
            entries.append({"path": relative, "bytes": len(data), "sha256": digest(data)})
    manifest_path = destination / f"{name}-manifest.json"
    manifest_path.write_text(json.dumps({
        "schema": "cwcw/download-manifest/v1", "archive": archive_path.name,
        "root": prefix, "files": entries,
    }, indent=2) + "\n", encoding="utf-8", newline="\n")
    return [archive_path, manifest_path]


def main():
    destination = ROOT / "docs/packs"
    artifacts = []
    for source, prefix, name in PACKAGES:
        artifacts.extend(build_package(ROOT / source, prefix, name, destination))
    (destination / "SHA256SUMS").write_text("".join(
        f"{digest(p.read_bytes())}  {p.name}\n" for p in sorted(artifacts)
    ), encoding="utf-8", newline="\n")
    print("Built 3 deterministic ZIPs, public file manifests and SHA256SUMS")


if __name__ == "__main__":
    main()
