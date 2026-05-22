#!/usr/bin/env python3
"""
Render the Friday Frame default OG image.

Layout (1200x630):
  Left 500x630   portrait crop of public/images/hero-portrait.jpg, slightly desaturated
                 to match the existing site OG style.
  Right 700x630  cream panel (#F2EBDB) with FRIDAY FRAME eyebrow, a gold rule,
                 a three-line serif headline ("A weekly / 200-word / frame."),
                 a one-line tagline, and the URL footer.

Output: public/og/friday-frame-default.png
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageEnhance

REPO = Path(__file__).resolve().parent.parent
PORTRAIT = REPO / "public" / "images" / "hero-portrait.jpg"
OUT = REPO / "public" / "og" / "friday-frame-default.png"
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630
LEFT_W = 500
RIGHT_X = LEFT_W
RIGHT_W = W - LEFT_W

NAVY = (20, 38, 76)        # #14264C
GOLD = (216, 154, 85)      # #D89A55
CREAM = (242, 235, 219)    # #F2EBDB
INK = (26, 23, 20)         # #1A1714
INK_SOFT = (107, 99, 87)   # #6B6357

# 1. Portrait, cropped to 500x630 with face centred.
src = Image.open(PORTRAIT).convert("RGB")
sw, sh = src.size
scale = max(LEFT_W / sw, H / sh)
nw, nh = int(sw * scale), int(sh * scale)
src = src.resize((nw, nh), Image.LANCZOS)
# Centre horizontally, anchor to top so the face stays in frame.
left_offset = (nw - LEFT_W) // 2
portrait = src.crop((left_offset, 0, left_offset + LEFT_W, H))
# Slight desaturation to match the existing OG image's restrained tonality.
portrait = ImageEnhance.Color(portrait).enhance(0.55)

# 2. Right panel.
canvas = Image.new("RGB", (W, H), CREAM)
canvas.paste(portrait, (0, 0))

draw = ImageDraw.Draw(canvas)

# Fonts. Liberation Serif is the metric-compatible Times stand-in we have locally.
SERIF_REG = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SERIF_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SANS_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

eyebrow_font = ImageFont.truetype(SANS_BOLD, 24)
headline_font = ImageFont.truetype(SERIF_REG, 78)
period_font = ImageFont.truetype(SERIF_BOLD, 78)
tagline_font = ImageFont.truetype(SERIF_REG, 22)
url_font = ImageFont.truetype(SANS_REG, 16)

PAD = 60
x = RIGHT_X + PAD

# Eyebrow with letter-spacing.
def draw_tracked(draw, xy, text, font, fill, tracking_px=4):
    x0, y0 = xy
    for ch in text:
        draw.text((x0, y0), ch, font=font, fill=fill)
        w = draw.textlength(ch, font=font)
        x0 += w + tracking_px

draw_tracked(draw, (x, 130), "FRIDAY FRAME", eyebrow_font, INK_SOFT, tracking_px=3)

# Gold rule under the eyebrow.
draw.rectangle([x, 175, x + 120, 178], fill=GOLD)

# Three-line headline.
lines = ["A weekly", "200-word", "frame"]
y = 235
for i, line in enumerate(lines):
    draw.text((x, y), line, font=headline_font, fill=NAVY)
    if i == len(lines) - 1:
        # Trailing gold period after "frame".
        line_w = draw.textlength(line, font=headline_font)
        draw.text((x + line_w, y), ".", font=period_font, fill=GOLD)
    y += 84

# Tagline (2 lines).
draw.text((x, 510), "Applied intelligence, governance,", font=tagline_font, fill=INK)
draw.text((x, 540), "and commercial leadership. Asia-Pacific.", font=tagline_font, fill=INK)

# URL footer.
draw.text((x, 588), "adrianwatkins.com  /  writing  /  friday-frame",
          font=url_font, fill=INK_SOFT)

canvas.save(OUT, "PNG", optimize=True)
print(f"Wrote: {OUT}  ({canvas.size[0]}x{canvas.size[1]})")
