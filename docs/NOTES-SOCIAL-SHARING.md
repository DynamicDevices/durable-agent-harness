# Notes social-sharing contract

Checked: 2026-08-15

Each published note has a stable page under
`https://chopwoodcarrywater.uk/notes/`. The page owns the title, summary,
preview image, dates and structured data used by search engines and social
networks.

## Required page contract

- production canonical URL, including on a review host
- `robots=index,follow,max-image-preview:large`
- `og:type=article` with URL, title, description and image metadata
- exact 1200 × 627 PNG Open Graph card, sRGB, below 5 MB, with alt text
- publication/modification dates, author, section and tags
- `twitter:card=summary_large_image`
- one `BlogPosting` JSON-LD object with a 1200 × 627 `ImageObject`
- LinkedIn share-offsite link using the canonical URL
- Copy link button with an accessible live-region confirmation
- entry in `sitemap.xml`, `feed.xml` and `llms.txt`

LinkedIn's composer supplies the reader's post text. Do not prefill it.

## Provenance

For an adaptation of Alex's earlier public writing:

- preserve the original publication date and exact source URL
- show the current adaptation date separately
- use the adaptation date as `dateModified`
- do not imply this site hosted the original
- use only Alex-owned, licensed or explicitly approved assets

## Build and verify

```bash
npm run cards
npm run sync
npm test
```

Run local mobile Lighthouse on the homepage and representative notes. A
Lighthouse SEO score of 100 confirms the audited checks, not search ranking.
After production publication, inspect each new canonical in LinkedIn Post
Inspector to refresh and verify its cached preview.

Sources:

- LinkedIn Help, “Make your website shareable on LinkedIn”:
  https://www.linkedin.com/help/linkedin/answer/a521928
- Hootsuite social media image sizes:
  https://blog.hootsuite.com/social-media-image-sizes-guide/
