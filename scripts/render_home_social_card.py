#!/usr/bin/env python3
"""Render the 1200×627 homepage card used by LinkedIn and Open Graph."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "assets" / "og-cover.jpg"
OUTPUT = ROOT / "docs" / "assets" / "og-cover-v2.png"
W, H = 1200, 627

FONT_DIR = Path.home() / ".fonts"
SORA = FONT_DIR / "Sora-ExtraBold.ttf"
SPACE = FONT_DIR / "SpaceGrotesk-Medium.ttf"
PLEX = FONT_DIR / "IBMPlexSans-Regular.ttf"

CARBON = (11, 18, 16)
CLOUD = (247, 249, 252)
MUTED = (205, 216, 211)
TIMBER = (196, 138, 74)
WATER = (42, 132, 150)
LIME = (155, 203, 112)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    source = source.crop((0, 0, W, H))
    source = ImageEnhance.Color(source).enhance(0.78)
    source = ImageEnhance.Contrast(source).enhance(1.08)

    # Keep the wood-and-water photograph legible while reserving a calm text field.
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pixels = shade.load()
    for x in range(W):
        left = max(0.0, 1.0 - x / 930)
        alpha = int(80 + 145 * left)
        for y in range(H):
            pixels[x, y] = (*CARBON, alpha)
    shade = shade.filter(ImageFilter.GaussianBlur(7))
    image = Image.alpha_composite(source.convert("RGBA"), shade)
    draw = ImageDraw.Draw(image)

    draw.text((62, 46), "CHOP WOOD CARRY WATER", font=font(SPACE, 24), fill=CLOUD)
    draw.text((62, 82), "PUBLIC ENGINEERING NOTEBOOK", font=font(SPACE, 13), fill=MUTED)
    draw.rounded_rectangle((62, 119, 170, 125), radius=3, fill=TIMBER)
    draw.rounded_rectangle((170, 119, 254, 125), radius=3, fill=WATER)
    draw.rounded_rectangle((254, 119, 310, 125), radius=3, fill=LIME)

    title_face = font(SORA, 62)
    draw.text((58, 174), "DURABLE", font=title_face, fill=CLOUD)
    draw.text((58, 246), "AGENT HARNESS", font=title_face, fill=CLOUD)

    deck_face = font(PLEX, 27)
    draw.text((62, 352), "A durable working relationship", font=deck_face, fill=CLOUD)
    draw.text((62, 389), "with coding agents.", font=deck_face, fill=CLOUD)

    label_face = font(SPACE, 17)
    labels = [
        ("CODEX-FIRST", WATER),
        ("SKILLS", TIMBER),
        ("MEMORY", LIME),
        ("PROOF", CLOUD),
    ]
    x = 62
    for label, colour in labels:
        bbox = draw.textbbox((0, 0), label, font=label_face)
        width = bbox[2] - bbox[0]
        draw.rounded_rectangle((x, 464, x + width + 28, 503), radius=19, fill=(*CARBON, 205), outline=colour, width=2)
        draw.text((x + 14, 473), label, font=label_face, fill=CLOUD)
        x += width + 40

    draw.text((62, 565), "chopwoodcarrywater.uk", font=font(SPACE, 18), fill=CLOUD)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(OUTPUT, format="PNG", optimize=True)
    print(f"{OUTPUT.relative_to(ROOT)} {W}×{H} {OUTPUT.stat().st_size} bytes")


if __name__ == "__main__":
    main()
