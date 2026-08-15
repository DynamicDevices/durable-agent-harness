#!/usr/bin/env python3
"""Render 1200×627 Chop Wood Carry Water Open Graph cards."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "assets" / "notes"
W, H = 1200, 627
CARBON = "#0B1210"
CARBON_2 = "#16231F"
CLOUD = "#F7F9FC"
MUTED = "#B9C5C1"
TIMBER = "#C48A4A"
WATER = "#2A8496"
LIME = "#9BCB70"

FONT_DIR = Path.home() / ".fonts"
SORA = FONT_DIR / "Sora-ExtraBold.ttf"
SPACE = FONT_DIR / "SpaceGrotesk-Medium.ttf"
PLEX = FONT_DIR / "IBMPlexSans-Regular.ttf"


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def background(seed: int) -> Image.Image:
    image = Image.new("RGB", (W, H), CARBON)
    pixels = image.load()
    centre_x = 870 + (seed % 5) * 45
    centre_y = 185 + (seed % 3) * 100
    for y in range(H):
        for x in range(W):
            water = max(
                0.0,
                1.0 - (((x - centre_x) / 780) ** 2 + ((y - centre_y) / 520) ** 2),
            )
            timber = max(
                0.0,
                1.0 - (((x - 1180) / 900) ** 2 + ((y - 650) / 700) ** 2),
            )
            base = (11, 18, 16)
            pixels[x, y] = (
                int(base[0] + 8 * water + 24 * timber),
                int(base[1] + 28 * water + 10 * timber),
                int(base[2] + 31 * water + 2 * timber),
            )
    return image


def fit_lines(draw: ImageDraw.ImageDraw, text: str, max_width: int) -> tuple[list[str], int]:
    for size in (52, 48, 44, 40):
        face = font(SORA, size)
        lines: list[str] = []
        current = ""
        for word in text.split():
            candidate = f"{current} {word}".strip()
            if draw.textbbox((0, 0), candidate, font=face)[2] <= max_width:
                current = candidate
            else:
                if current:
                    lines.append(current)
                current = word
        if current:
            lines.append(current)
        if len(lines) <= 4:
            return lines, size
    return lines, 40


def draw_card(post: dict, index: int) -> None:
    image = background(index)
    draw = ImageDraw.Draw(image)
    draw.text((64, 44), "CHOP WOOD CARRY WATER", font=font(SPACE, 23), fill=CLOUD)
    draw.text((64, 80), "DURABLE AGENT HARNESS", font=font(SPACE, 13), fill=MUTED)
    draw.rounded_rectangle((64, 116, 170, 121), radius=2, fill=TIMBER)
    draw.rounded_rectangle((170, 116, 252, 121), radius=2, fill=WATER)
    draw.rounded_rectangle((252, 116, 305, 121), radius=2, fill=LIME)

    draw.text((64, 158), post.get("section", "ENGINEERING PRACTICE").upper(), font=font(SPACE, 17), fill=WATER)
    lines, size = fit_lines(draw, post["title"], 750)
    y = 198
    for line in lines:
        draw.text((64, y), line, font=font(SORA, size), fill=CLOUD)
        y += size + 10

    summary = post["summary"]
    words = summary.split()
    deck_lines = []
    current = ""
    face = font(PLEX, 21)
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=face)[2] <= 710:
            current = candidate
        else:
            deck_lines.append(current)
            current = word
    if current:
        deck_lines.append(current)
    draw.multiline_text((64, min(y + 16, 475)), "\n".join(deck_lines[:2]), font=face, fill=MUTED, spacing=6)
    draw.text((64, 564), "chopwoodcarrywater.uk/notes", font=font(SPACE, 16), fill=CLOUD)

    # Quiet wood/water motif: a timber square and water rings joined by work.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((865, 205, 1125, 465), outline=(42, 132, 150, 120), width=22)
    gd.rectangle((915, 255, 1075, 415), outline=(196, 138, 74, 140), width=20)
    glow = glow.filter(ImageFilter.GaussianBlur(18))
    image.paste(glow, mask=glow)
    draw = ImageDraw.Draw(image)
    draw.ellipse((865, 205, 1125, 465), outline=WATER, width=5)
    draw.ellipse((905, 245, 1085, 425), outline=LIME, width=3)
    draw.rectangle((935, 275, 1055, 395), outline=TIMBER, width=6)

    path = OUT / f"{post['id']}-og.png"
    image.save(path, optimize=True)
    print(f"{path.relative_to(ROOT)} {W}×{H} {path.stat().st_size} bytes")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    data = json.loads((ROOT / "content" / "blog.json").read_text())
    for index, post in enumerate(data["posts"]):
        draw_card(post, index)


if __name__ == "__main__":
    main()
