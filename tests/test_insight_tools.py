#!/usr/bin/env python3

import importlib.util
import json
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
publish_review = load_module(
    "publish_review", ROOT / "scripts" / "publish_insight_review.py"
)
render_reviews = load_module(
    "render_reviews", ROOT / "scripts" / "render_review_drafts.py"
)


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

    def test_review_import_copies_only_article(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package = root / "private-package"
            package.mkdir()
            (package / "manifest.json").write_text(
                json.dumps(
                    {
                        "id": "safe-review",
                        "created": "2026-09-20",
                        "title": "Safe review",
                        "summary": "A review summary.",
                        "section": "Working practice",
                        "reviewImage": "../assets/review/safe-review.png",
                        "imageAlt": "A safe review image.",
                        "imageDisclosure": "Generated image disclosure.",
                    }
                )
            )
            (package / "draft-package.md").write_text(
                """# Safe review

## CWCW insight draft

The public article with `code`.

## Image brief

A newly generated scene specific to this article.

## Research and caveats

PRIVATE CORRESPONDENCE

## Raw material

PRIVATE RAW MATERIAL
"""
            )
            target = publish_review.prepare_review(package, root / "reviews")
            review = json.loads(target.read_text())
            self.assertEqual(review["status"], "review")
            self.assertIn("The public article", review["bodyMarkdown"])
            self.assertEqual(review["reviewImage"], "../assets/review/safe-review.png")
            self.assertIn("specific to this article", review["imageBrief"])
            self.assertNotIn("PRIVATE CORRESPONDENCE", target.read_text())
            self.assertNotIn("PRIVATE RAW MATERIAL", target.read_text())

    def test_review_import_requires_post_specific_image_metadata(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package = root / "incomplete-package"
            package.mkdir()
            (package / "manifest.json").write_text(
                json.dumps(
                    {
                        "id": "incomplete-review",
                        "created": "2026-09-20",
                        "title": "Incomplete review",
                        "summary": "A review without its own image.",
                        "section": "Working practice",
                    }
                )
            )
            (package / "draft-package.md").write_text(
                """## CWCW insight draft

Article text.

## Image brief

A scene made specifically for this post.
"""
            )
            with self.assertRaisesRegex(ValueError, "reviewImage"):
                publish_review.prepare_review(package, root / "reviews")

    def test_review_page_is_unlisted_and_escapes_html(self):
        rendered = render_reviews.render_review(
            {
                "status": "review",
                "id": "safe-review",
                "created": "2026-09-20",
                "title": "Safe review",
                "summary": "A review summary.",
                "section": "Working practice",
                "reviewImage": "../assets/review/safe-review.png",
                "imageAlt": "A safe review image.",
                "imageDisclosure": "Generated image disclosure.",
                "bodyMarkdown": "### Heading\n\n<script>alert(1)</script>",
            }
        )
        self.assertIn("noindex,nofollow,noarchive,nosnippet,noimageindex", rendered)
        self.assertIn("Review draft — not published", rendered)
        self.assertIn("&lt;script&gt;alert(1)&lt;/script&gt;", rendered)
        self.assertNotIn('<link rel="canonical"', rendered)
        self.assertNotIn('property="og:', rendered)
        self.assertNotIn("application/ld+json", rendered)
        self.assertNotIn("Share this insight", rendered)
        self.assertIn('../assets/review/safe-review.png', rendered)
        self.assertIn("Generated image disclosure.", rendered)

    def test_review_markdown_keeps_wrapped_list_items_together(self):
        rendered = render_reviews.render_markdown(
            "1. Register the build,\n   its task and expiry.\n2. Stop the task."
        )
        self.assertIn("<ol>", rendered)
        self.assertIn("Register the build, its task and expiry.", rendered)
        self.assertEqual(rendered.count("<li>"), 2)


if __name__ == "__main__":
    unittest.main()
