#!/usr/bin/env python3
"""Render crawlable CWCW note pages and discovery files from blog.json."""

from __future__ import annotations

import email.utils
import html
import json
from datetime import date, datetime, timezone
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content" / "blog.json"
DOCS = ROOT / "docs"
NOTES = DOCS / "notes"
ORIGIN = "https://chopwoodcarrywater.uk"


def ordinal(day: int) -> str:
    if 10 < day % 100 < 14:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    return f"{day}{suffix}"


def display_date(value: str) -> str:
    parsed = date.fromisoformat(value)
    return f"{ordinal(parsed.day)} {parsed.strftime('%B %Y')}"


def canonical(post: dict) -> str:
    return f"{ORIGIN}/notes/{post['id']}.html"


def image_url(post: dict) -> str:
    return f"{ORIGIN}/assets/notes/{post['id']}-og.png"


def render_note(post: dict) -> str:
    url = canonical(post)
    image = image_url(post)
    title = html.escape(post["title"])
    summary = html.escape(post["summary"])
    published = post["date"]
    modified = post.get("dateModified", published)
    tags = post.get("tags", ["AI agents", "engineering practice"])
    tags_meta = "\n".join(
        f'  <meta property="article:tag" content="{html.escape(tag)}">' for tag in tags
    )
    paragraphs = "\n".join(f"        <p>{html.escape(p)}</p>" for p in post["body"])
    provenance = ""
    if post.get("sourceUrl"):
        provenance = f"""
      <aside class="note-provenance">
        <strong>From the archive</strong>
        <span>Originally published on {html.escape(post.get("sourceName", "the source"))}
        on <time datetime="{published}">{display_date(published)}</time>. Adapted for
        Chop Wood Carry Water on <time datetime="{modified}">{display_date(modified)}</time>.</span>
        <a href="{html.escape(post["sourceUrl"])}" target="_blank" rel="noopener noreferrer">View the original</a>
      </aside>"""
    json_ld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": f"{url}#article",
        "url": url,
        "headline": post["title"],
        "description": post["summary"],
        "datePublished": published,
        "dateModified": modified,
        "inLanguage": "en-GB",
        "articleSection": post.get("section", "Engineering practice"),
        "keywords": tags,
        "author": {
            "@type": "Person",
            "name": "Alex Lennon",
            "url": ORIGIN,
            "sameAs": ["https://x.com/embedded_iot"],
        },
        "publisher": {
            "@type": "Organization",
            "name": "Chop Wood Carry Water",
            "url": ORIGIN,
            "logo": {
                "@type": "ImageObject",
                "url": f"{ORIGIN}/assets/chopwood-mark.png",
            },
        },
        "image": {
            "@type": "ImageObject",
            "url": image,
            "width": 1200,
            "height": 627,
        },
        "mainEntityOfPage": url,
        "license": "https://creativecommons.org/licenses/by-sa/4.0/",
    }
    linkedin = (
        "https://www.linkedin.com/sharing/share-offsite/?url=" + quote(url, safe="")
    )
    return f"""<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} — Chop Wood Carry Water</title>
  <meta name="description" content="{summary}">
  <meta name="author" content="Alex Lennon">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#0B1210">
  <link rel="canonical" href="{url}">
  <link rel="alternate" type="application/rss+xml" title="Chop Wood Carry Water notes" href="{ORIGIN}/feed.xml">
  <link rel="icon" href="../assets/chopwood-mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../styles.css">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Chop Wood Carry Water">
  <meta property="og:locale" content="en_GB">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{summary}">
  <meta property="og:image" content="{image}">
  <meta property="og:image:secure_url" content="{image}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="627">
  <meta property="og:image:alt" content="Chop Wood Carry Water note: {title}">
  <meta property="article:published_time" content="{published}">
  <meta property="article:modified_time" content="{modified}">
  <meta property="article:author" content="Alex Lennon">
  <meta property="article:section" content="{html.escape(post.get("section", "Engineering practice"))}">
{tags_meta}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:creator" content="@embedded_iot">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{summary}">
  <meta name="twitter:image" content="{image}">
  <meta name="twitter:image:alt" content="Chop Wood Carry Water note: {title}">
  <script type="application/ld+json">
{json.dumps(json_ld, indent=2, ensure_ascii=False)}
  </script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="top note-top">
    <a class="brand" href="../index.html" aria-label="Chop Wood Carry Water — Durable Agent Harness home">
      <img src="../assets/chopwood-mark.png" alt="" width="35" height="35">
      <span class="brand-text"><strong>Chop Wood Carry Water</strong><em>Durable Agent Harness</em></span>
    </a>
    <nav class="nav" aria-label="Primary"><a href="../index.html">Notebook</a><a href="../index.html#blog">Notes</a></nav>
  </header>
  <main id="main">
    <article class="note-article">
      <header class="note-header">
        <p class="breadcrumb"><a href="../index.html">Home</a> / <a href="../index.html#blog">Notes</a></p>
        <p class="kicker">{html.escape(post.get("section", "Engineering practice"))} · {display_date(published)}</p>
        <h1>{title}</h1>
        <p class="note-byline">Alex Lennon · <a href="https://x.com/embedded_iot" rel="me">@embedded_iot</a></p>
        <p class="note-lede">{summary}</p>
{provenance}
      </header>
      <figure class="note-hero">
        <img src="../assets/notes/{post['id']}-og.png" width="1200" height="627"
             alt="Illustrated title card for {title}" fetchpriority="high">
      </figure>
      <div class="note-body">
{paragraphs}
      </div>
      <footer class="note-footer">
        <div class="note-share" aria-labelledby="share-heading">
          <p class="kicker" id="share-heading">Share this note</p>
          <p>Share the canonical article link with its Chop Wood Carry Water preview card.</p>
          <div class="cta-row">
            <a class="btn primary" href="{linkedin}" target="_blank" rel="noopener noreferrer">Share on LinkedIn</a>
            <button class="btn ghost copy-link" type="button" data-copy-url="{url}">Copy link</button>
          </div>
          <p class="copy-link__status" role="status" aria-live="polite"></p>
        </div>
        <p><a class="text-link" href="../index.html#blog">All notes</a></p>
      </footer>
    </article>
  </main>
  <footer class="footer"><div class="wrap footer-inner"><p>Alex Lennon · Chop Wood Carry Water</p><p class="tagline-foot">Chop wood. Carry water.</p></div></footer>
  <script>
  (() => {{
    const button = document.querySelector(".copy-link");
    const status = document.querySelector(".copy-link__status");
    button.addEventListener("click", async () => {{
      const value = button.dataset.copyUrl;
      try {{
        await navigator.clipboard.writeText(value);
      }} catch (_) {{
        const input = document.createElement("textarea");
        input.value = value;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }}
      status.textContent = "Link copied.";
    }});
  }})();
  </script>
</body>
</html>
"""


def render_feed(posts: list[dict]) -> str:
    items = []
    newest = max(post.get("dateModified", post["date"]) for post in posts)
    build_date = datetime.fromisoformat(newest).replace(tzinfo=timezone.utc)
    for post in posts:
        url = canonical(post)
        published = datetime.fromisoformat(post["date"]).replace(tzinfo=timezone.utc)
        body = "".join(f"<p>{html.escape(p)}</p>" for p in post["body"])
        items.append(
            f"""    <item>
      <title>{html.escape(post["title"])}</title>
      <link>{url}</link>
      <guid isPermaLink="true">{url}</guid>
      <pubDate>{email.utils.format_datetime(published)}</pubDate>
      <description>{html.escape(post["summary"])}</description>
      <content:encoded><![CDATA[{body}]]></content:encoded>
    </item>"""
        )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Chop Wood Carry Water notes</title>
    <link>{ORIGIN}/</link>
    <description>Engineering notes on durable working relationships with AI coding agents.</description>
    <language>en-gb</language>
    <lastBuildDate>{email.utils.format_datetime(build_date)}</lastBuildDate>
{chr(10).join(items)}
  </channel>
</rss>
"""


def render_sitemap(posts: list[dict]) -> str:
    urls = [
        ("/", max(post.get("dateModified", post["date"]) for post in posts), "1.0"),
        ("/agents.html", "2026-08-09", "0.8"),
    ]
    urls.extend(
        (f"/notes/{post['id']}.html", post.get("dateModified", post["date"]), "0.9")
        for post in posts
    )
    rows = "\n".join(
        f"""  <url>
    <loc>{ORIGIN}{path}</loc>
    <lastmod>{lastmod}</lastmod>
    <priority>{priority}</priority>
  </url>"""
        for path, lastmod, priority in urls
    )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{rows}
</urlset>
"""


def render_llms(posts: list[dict]) -> str:
    links = "\n".join(f"- [{post['title']}]({canonical(post)})" for post in posts)
    return f"""# Chop Wood Carry Water

> Alex Lennon's public engineering notebook on durable working relationships with AI coding agents.

## Main pages
- [Notebook]({ORIGIN}/)
- [Agents: start here]({ORIGIN}/agents.html)
- [RSS feed]({ORIGIN}/feed.xml)

## Notes
{links}
"""


def main() -> None:
    data = json.loads(CONTENT.read_text())
    posts = data["posts"]
    NOTES.mkdir(parents=True, exist_ok=True)
    expected = set()
    for post in posts:
        path = NOTES / f"{post['id']}.html"
        path.write_text(render_note(post))
        expected.add(path.name)
    for stale in NOTES.glob("*.html"):
        if stale.name not in expected:
            stale.unlink()
    (DOCS / "feed.xml").write_text(render_feed(posts))
    (DOCS / "sitemap.xml").write_text(render_sitemap(posts))
    (DOCS / "llms.txt").write_text(render_llms(posts))
    print(f"Rendered {len(posts)} notes, feed.xml, sitemap.xml and llms.txt")


if __name__ == "__main__":
    main()
