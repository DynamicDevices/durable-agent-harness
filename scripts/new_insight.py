#!/usr/bin/env python3
"""Create a private CWCW insight draft package from text material."""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path


DEFAULT_DRAFT_ROOT = Path.home() / "data_drive" / "dd" / "personal" / "cwcw-insights"


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    if not slug:
        raise ValueError("Title must contain at least one letter or number")
    return slug


def create_package(
    *, title: str, section: str, material: str, created: str, output_root: Path
) -> Path:
    slug = slugify(title)
    target = output_root.expanduser().resolve() / slug
    target.mkdir(parents=True, exist_ok=False)
    (target / "assets").mkdir()
    (target / "output").mkdir()

    manifest = {
        "status": "draft-private",
        "id": slug,
        "created": created,
        "title": title,
        "seoTitle": "",
        "summary": "",
        "section": section,
        "tags": [],
        "customCard": False,
        "imageAlt": "",
        "imageDisclosure": "",
        "body": [],
        "sources": [],
        "discussionUrl": "",
    }
    (target / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n"
    )
    draft = f"""# {title}

Status: private working draft
Created: {created}
Section: {section}

## Working claim

[State the single consequential claim in one sentence.]

## Synopsis

[Explain what this insight is about and why it matters.]

## CWCW insight draft

[Move from lived experience to the question, claim, evidence and practical proposal.]

## Research and caveats

- [Claim to verify]
- [Source]
- [Caveat that prevents a misleadingly neat story]

## LinkedIn draft

[Open the argument and earn the click rather than repeating the complete insight.]

(Cursor helped draft this)

## Image brief

[Subject, human activity, setting, composition, diversity and negative space.]

## Publication metadata

- Slug: `{slug}`
- SEO title:
- Summary:
- Tags:
- Image alt:
- Image disclosure:
- LinkedIn discussion URL: [add after the post is live]

## Raw material

```text
{material.rstrip()}
```

## Publication checklist

- [ ] Alex approved the final insight
- [ ] Facts and sources checked
- [ ] CWCW visual reviewed at 1200 x 627
- [ ] `content/blog.json` entry prepared
- [ ] Build, privacy and browser tests passed
- [ ] Production canonical and image bytes verified
- [ ] LinkedIn preview inspected
- [ ] `discussionUrl` added after posting
"""
    (target / "draft-package.md").write_text(draft)
    return target


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--title", required=True)
    parser.add_argument("--section", default="Working practice")
    parser.add_argument("--date", default=date.today().isoformat())
    parser.add_argument("--output-root", type=Path, default=DEFAULT_DRAFT_ROOT)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--text", help="A thought or rough note supplied directly")
    source.add_argument("--input", type=Path, help="UTF-8 text transcript or note")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.input:
        material = args.input.expanduser().read_text()
    else:
        material = args.text
    target = create_package(
        title=args.title,
        section=args.section,
        material=material,
        created=args.date,
        output_root=args.output_root,
    )
    print(target)


if __name__ == "__main__":
    main()
