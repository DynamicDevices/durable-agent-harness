#!/usr/bin/env python3
"""Copy only an insight article into the public-but-unlisted review lane."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REVIEW_SOURCE = ROOT / "content" / "review-drafts"
ARTICLE_HEADING = "## CWCW insight draft"
IMAGE_BRIEF_HEADING = "## Image brief"


def validate_slug(value: str) -> str:
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", value):
        raise ValueError(f"Invalid insight id: {value}")
    return value


def extract_section(markdown: str, heading: str) -> str:
    lines = markdown.splitlines()
    try:
        start = lines.index(heading) + 1
    except ValueError as error:
        raise ValueError(f"Draft is missing {heading!r}") from error

    end = len(lines)
    for index in range(start, len(lines)):
        if lines[index].startswith("## "):
            end = index
            break
    value = "\n".join(lines[start:end]).strip()
    if not value:
        raise ValueError(f"Draft section is empty: {heading}")
    return value + "\n"


def extract_article(markdown: str) -> str:
    return extract_section(markdown, ARTICLE_HEADING)


def prepare_review(package: Path, output_root: Path, replace: bool = False) -> Path:
    package = package.expanduser().resolve()
    manifest = json.loads((package / "manifest.json").read_text())
    package_markdown = (package / "draft-package.md").read_text()
    article = extract_article(package_markdown)
    image_brief = extract_section(package_markdown, IMAGE_BRIEF_HEADING)
    if image_brief.lstrip().startswith("["):
        raise ValueError("Replace the image brief placeholder before creating a review")
    slug = validate_slug(manifest["id"])

    required = (
        "title",
        "summary",
        "section",
        "created",
        "reviewImage",
        "imageAlt",
        "imageDisclosure",
    )
    missing = [key for key in required if not str(manifest.get(key, "")).strip()]
    if missing:
        raise ValueError(f"Draft manifest is missing: {', '.join(missing)}")

    review = {
        "schemaVersion": 1,
        "status": "review",
        "id": slug,
        "created": manifest["created"],
        "title": manifest["title"],
        "seoTitle": manifest.get("seoTitle") or manifest["title"],
        "summary": manifest["summary"],
        "section": manifest["section"],
        "tags": manifest.get("tags", []),
        "imageBrief": image_brief,
        "reviewImage": manifest["reviewImage"],
        "imageAlt": manifest["imageAlt"],
        "imageDisclosure": manifest["imageDisclosure"],
        "bodyMarkdown": article,
    }
    output_root.mkdir(parents=True, exist_ok=True)
    target = output_root / f"{slug}.json"
    if target.exists() and not replace:
        raise FileExistsError(f"Review already exists: {target}; pass --replace to update it")
    target.write_text(json.dumps(review, indent=2, ensure_ascii=False) + "\n")
    return target


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", required=True, type=Path)
    parser.add_argument("--output-root", type=Path, default=REVIEW_SOURCE)
    parser.add_argument("--replace", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    print(prepare_review(args.package, args.output_root, args.replace))


if __name__ == "__main__":
    main()
