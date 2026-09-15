#!/usr/bin/env python3

import importlib.util
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


new_insight = load_module("new_insight", ROOT / "scripts" / "new_insight.py")
render_notes = load_module("render_notes", ROOT / "scripts" / "render_notes.py")


class InsightToolsTest(unittest.TestCase):
    def test_private_draft_package_is_complete_and_non_destructive(self):
        with tempfile.TemporaryDirectory() as directory:
            target = new_insight.create_package(
                title="A Useful New Insight",
                section="Education",
                material="A rough thought from today.",
                created="2026-09-15",
                output_root=Path(directory),
            )
            self.assertEqual(target.name, "a-useful-new-insight")
            self.assertIn("## Raw material", (target / "draft-package.md").read_text())
            self.assertTrue((target / "manifest.json").exists())
            self.assertTrue((target / "assets").is_dir())
            self.assertTrue((target / "output").is_dir())
            with self.assertRaises(FileExistsError):
                new_insight.create_package(
                    title="A Useful New Insight",
                    section="Education",
                    material="Do not overwrite the first draft.",
                    created="2026-09-15",
                    output_root=Path(directory),
                )

    def test_linkedin_discussion_becomes_primary_action(self):
        post = {
            "id": "example",
            "date": "2026-09-15",
            "title": "Example insight",
            "summary": "A sufficiently descriptive summary for testing the insight renderer.",
            "body": ["A useful body."],
            "discussionUrl": "https://www.linkedin.com/posts/example",
        }
        rendered = render_notes.render_note(post)
        self.assertIn("Join the discussion on LinkedIn", rendered)
        self.assertIn(post["discussionUrl"], rendered)
        self.assertNotIn("Share on LinkedIn</a>", rendered)

    def test_non_linkedin_discussion_url_is_rejected(self):
        with self.assertRaises(ValueError):
            render_notes.linkedin_discussion_url(
                {"discussionUrl": "https://example.com/not-linkedin"}
            )


if __name__ == "__main__":
    unittest.main()
