#!/usr/bin/env python3
"""Render public-but-unlisted CWCW review drafts without discovery metadata."""

from __future__ import annotations

import html
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content" / "review-drafts"
OUTPUT = ROOT / "docs" / "review"


def inline_markdown(value: str) -> str:
    parts = value.split("`")
    rendered = []
    for index, part in enumerate(parts):
        escaped = html.escape(part)
        rendered.append(f"<code>{escaped}</code>" if index % 2 else escaped)
    return "".join(rendered)


def render_markdown(markdown: str) -> str:
    blocks: list[str] = []
    paragraph: list[str] = []
    list_kind: str | None = None
    list_items: list[str] = []

    def flush_paragraph() -> None:
        if paragraph:
            blocks.append(f"        <p>{inline_markdown(' '.join(paragraph))}</p>")
            paragraph.clear()

    def flush_list() -> None:
        nonlocal list_kind
        if list_kind:
            items = "\n".join(f"          <li>{inline_markdown(item)}</li>" for item in list_items)
            blocks.append(f"        <{list_kind}>\n{items}\n        </{list_kind}>")
            list_items.clear()
            list_kind = None

    for raw_line in markdown.splitlines():
        line = raw_line.strip()
        if not line:
            flush_paragraph()
            flush_list()
            continue
        if line.startswith("### "):
            flush_paragraph()
            flush_list()
            blocks.append(f"        <h2>{inline_markdown(line[4:])}</h2>")
            continue
        unordered = re.match(r"^-\s+(.+)$", line)
        ordered = re.match(r"^\d+\.\s+(.+)$", line)
        if unordered or ordered:
            flush_paragraph()
            desired = "ul" if unordered else "ol"
            if list_kind and list_kind != desired:
                flush_list()
            list_kind = desired
            list_items.append((unordered or ordered).group(1))
            continue
        if list_kind:
            list_items[-1] += " " + line
            continue
        flush_list()
        paragraph.append(line)

    flush_paragraph()
    flush_list()
    return "\n".join(blocks)


def render_review(draft: dict) -> str:
    if draft.get("status") != "review":
        raise ValueError(f"Review draft {draft.get('id', '<unknown>')} has invalid status")
    title = html.escape(draft["title"])
    seo_title = html.escape(draft.get("seoTitle") or draft["title"])
    summary = html.escape(draft["summary"])
    section = html.escape(draft["section"])
    created = html.escape(draft["created"])
    body = render_markdown(draft["bodyMarkdown"])
    return f"""<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Review draft: {seo_title} — Chop Wood Carry Water</title>
  <meta name="description" content="{summary}">
  <meta name="robots" content="noindex,nofollow,noarchive,nosnippet,noimageindex">
  <meta name="theme-color" content="#0B1210">
  <link rel="icon" href="../assets/chopwood-mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../styles.css">
</head>
<body class="review-page">
  <a class="skip" href="#main">Skip to content</a>
  <header class="top note-top">
    <a class="brand" href="../index.html" aria-label="Chop Wood Carry Water — Durable Agent Harness home">
      <img src="../assets/chopwood-mark.png" alt="" width="35" height="35">
      <span class="brand-text"><strong>Chop Wood Carry Water</strong><em>Durable Agent Harness</em></span>
    </a>
    <nav class="nav" aria-label="Primary"><a href="../index.html">Notebook</a></nav>
  </header>
  <main id="main">
    <article class="note-article">
      <aside class="review-banner" aria-label="Publication status">
        <strong>Review draft — not published</strong>
        <span>This public, unlisted page is for editorial review. It may change or be withdrawn.</span>
      </aside>
      <header class="note-header">
        <p class="kicker">{section} · draft {created}</p>
        <h1>{title}</h1>
        <p class="note-byline">Alex Lennon</p>
        <p class="note-lede">{summary}</p>
      </header>
      <div class="note-body review-body">
{body}
      </div>
      <footer class="note-footer review-footer">
        <p><strong>End of review draft.</strong> This page is deliberately absent from Insights, RSS, the sitemap and <code>llms.txt</code>.</p>
      </footer>
    </article>
  </main>
  <footer class="footer"><div class="wrap footer-inner"><p>Alex Lennon · Chop Wood Carry Water</p><p class="tagline-foot">Chop wood. Carry water.</p></div></footer>
</body>
</html>
"""


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    expected: set[str] = set()
    if SOURCE.exists():
        for source in sorted(SOURCE.glob("*.json")):
            draft = json.loads(source.read_text())
            target = OUTPUT / f"{draft['id']}.html"
            target.write_text(render_review(draft))
            expected.add(target.name)
    for stale in OUTPUT.glob("*.html"):
        if stale.name not in expected:
            stale.unlink()
    print(f"Rendered {len(expected)} unlisted review draft(s)")


if __name__ == "__main__":
    main()
