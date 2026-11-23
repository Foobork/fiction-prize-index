import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630

# Create base canvas with deep literary dark theme (#0c1017)
card = Image.new('RGBA', (W, H), (12, 16, 23, 255))
draw = ImageDraw.Draw(card)

# Load fonts
try:
    font_title = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 56)
    font_subtitle = ImageFont.truetype('C:/Windows/Fonts/georgiai.ttf', 24)
    font_badge = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 16)
    font_prizes = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 18)
    font_spine_title = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 16)
    font_spine_sub = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 12)
    font_url = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 18)
except Exception as e:
    print("Font error:", e)
    font_title = font_subtitle = font_badge = font_prizes = font_spine_title = font_spine_sub = font_url = ImageFont.load_default()

# 1. Subtle background glow / vignette
gradient = Image.new('RGBA', (W, H), (0, 0, 0, 0))
g_draw = ImageDraw.Draw(gradient)

# Radial gradient circle at top-left behind logo
for r in range(400, 0, -10):
    alpha = int(25 * (1 - r / 400))
    g_draw.ellipse([60 - r, 120 - r, 60 + r, 120 + r], fill=(212, 175, 55, alpha))

card = Image.alpha_composite(card, gradient)
draw = ImageDraw.Draw(card)

# 2. Elegant gold perimeter border (double frame)
draw.rectangle([20, 20, W - 20, H - 20], outline=(212, 175, 55, 120), width=2)
draw.rectangle([26, 26, W - 26, H - 26], outline=(212, 175, 55, 60), width=1)

# Corner ornamental accents
for cx, cy in [(20, 20), (W - 20, 20), (20, H - 20), (W - 20, H - 20)]:
    draw.rectangle([cx - 4, cy - 4, cx + 4, cy + 4], fill=(212, 175, 55, 200))

# 3. Paste Moose Logo
moose_path = 'public/moose-white.png'
if os.path.exists(moose_path):
    moose_img = Image.open(moose_path).convert('RGBA')
    moose_img = moose_img.resize((100, 100), Image.Resampling.LANCZOS)
    # Tint moose with soft warm gold
    r, g, b, a = moose_img.split()
    # Colorize white to amber gold (245, 205, 120)
    gold_moose = Image.merge('RGBA', (
        r.point(lambda p: int(p * 245 / 255)),
        g.point(lambda p: int(p * 205 / 255)),
        b.point(lambda p: int(p * 120 / 255)),
        a
    ))
    card.paste(gold_moose, (70, 60), gold_moose)

# 4. Brand Typography
# Title: MOSTLY FICTION
draw.text((190, 68), "MOSTLY FICTION", fill=(255, 250, 240), font=font_title)

# Gold accent bar under title
draw.line([(190, 140), (620, 140)], fill=(212, 175, 55, 220), width=3)

# Subtitle
draw.text((70, 165), "The Open Literary Prize Index & Virtual Bookshelf", fill=(212, 175, 55), font=font_subtitle)

# Description paragraph / prize roll call
draw.text((70, 208), "Cross-indexed winners, shortlists, and publishing history for:", fill=(160, 174, 192), font=font_prizes)
draw.text((70, 238), "The Booker Prize • Pulitzer Prize • Nobel Prize • Prix Goncourt", fill=(230, 235, 245), font=font_prizes)
draw.text((70, 268), "Hugo & Nebula • Women's Prize • Dublin Award • Edgar Awards", fill=(230, 235, 245), font=font_prizes)

# 5. Badges / Stat Pills
stats = [
    ("22 Major Honors", (180, 83, 9)),       # Amber
    ("4,000+ Books", (21, 128, 61)),         # Emerald
    ("2,600+ Authors", (2, 132, 199)),       # Sky Blue
    ("120+ Yrs History", (124, 58, 237))     # Violet
]

badge_y = 325
badge_x = 70
for text, color in stats:
    # Measure text width
    bbox = font_badge.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pw, ph = tw + 28, 38
    
    # Pill background
    draw.rounded_rectangle([badge_x, badge_y, badge_x + pw, badge_y + ph], radius=19, fill=(*color, 50), outline=(*color, 200), width=1)
    # Dot
    draw.ellipse([badge_x + 12, badge_y + 14, badge_x + 22, badge_y + 24], fill=(*color, 255))
    # Text
    draw.text((badge_x + 28, badge_y + 9), text, fill=(255, 255, 255), font=font_badge)
    badge_x += pw + 16

# 6. Feature Highlights Row
features = [
    "✓ 100% Client-Side & Static-First",
    "✓ Interactive Spine-Width Bookshelf",
    "✓ Multi-Winner Overlap & Triple Crown",
    "✓ Local-First Personal Reading List"
]
feat_y = 390
for i, feat in enumerate(features):
    fx = 70 if i % 2 == 0 else 360
    fy = feat_y + (i // 2) * 32
    draw.text((fx, fy), feat, fill=(180, 190, 205), font=font_prizes)

# Bottom URL Bar
draw.rounded_rectangle([70, 520, 560, 565], radius=8, fill=(20, 28, 42), outline=(212, 175, 55, 100), width=1)
draw.text((90, 532), "🌐 foobork.github.io/fiction-prize-index", fill=(245, 215, 140), font=font_url)


# 7. Simulated 3D Bookshelf on Right Side
# Shelf base
shelf_x1 = 660
shelf_x2 = 1140
shelf_y = 530

# Wood shelf ledge
draw.rectangle([shelf_x1, shelf_y, shelf_x2, shelf_y + 20], fill=(78, 53, 36))
draw.rectangle([shelf_x1, shelf_y + 20, shelf_x2, shelf_y + 35], fill=(50, 32, 20))
draw.line([(shelf_x1, shelf_y), (shelf_x2, shelf_y)], fill=(180, 140, 90), width=2)

# Spines configuration: (Title, Author, Year, Color, Width, Height)
spines = [
    ("THE ENGLISH PATIENT", "Michael Ondaatje", "1992", (153, 27, 27), 54, 380),       # Burgundy (Booker)
    ("MIDNIGHT'S CHILDREN", "Salman Rushdie", "1981", (180, 83, 9), 56, 420),        # Amber (Booker of Bookers)
    ("THE ROAD", "Cormac McCarthy", "2006", (30, 41, 59), 48, 360),                  # Slate (Pulitzer)
    ("DUNE", "Frank Herbert", "1965", (194, 65, 12), 58, 440),                       # Terracotta (Hugo/Nebula)
    ("BELOVED", "Toni Morrison", "1987", (67, 20, 7), 52, 400),                      # Deep Mahogany (Pulitzer)
    ("THE VEGETARIAN", "Han Kang", "2016", (21, 128, 61), 46, 350),                   # Emerald (Int Booker)
    ("THE ANOMALY", "Hervé Le Tellier", "2020", (30, 58, 138), 50, 370),              # Royal Blue (Goncourt)
    ("WOLF HALL", "Hilary Mantel", "2009", (112, 26, 117), 60, 430),                 # Imperial Purple (Booker)
]

curr_x = shelf_x1 + 20
for title, author, year, color, sw, sh in spines:
    sy = shelf_y - sh
    # Spine rectangle
    draw.rectangle([curr_x, sy, curr_x + sw, shelf_y], fill=color)
    # Highlights & shadows for 3D curved spine effect
    draw.line([(curr_x, sy), (curr_x, shelf_y)], fill=(255, 255, 255, 70), width=2)
    draw.line([(curr_x + sw, sy), (curr_x + sw, shelf_y)], fill=(0, 0, 0, 90), width=2)
    draw.line([(curr_x + 3, sy), (curr_x + 3, shelf_y)], fill=(255, 255, 255, 30), width=1)
    
    # Gold foil band at top
    draw.rectangle([curr_x + 4, sy + 14, curr_x + sw - 4, sy + 18], fill=(245, 215, 110))
    draw.rectangle([curr_x + 4, sy + 22, curr_x + sw - 4, sy + 24], fill=(245, 215, 110))
    
    # Gold trophy seal dot
    draw.ellipse([curr_x + sw//2 - 6, sy + 32, curr_x + sw//2 + 6, sy + 44], fill=(245, 215, 110), outline=(180, 130, 40))
    
    # Vertical spine text: create rotated text image
    text_img_h = sw
    text_img_w = sh - 100
    t_img = Image.new('RGBA', (text_img_w, text_img_h), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(t_img)
    t_draw.text((0, 6), title, fill=(255, 250, 240), font=font_spine_title)
    t_draw.text((0, 26), author, fill=(220, 220, 220, 200), font=font_spine_sub)
    
    # Rotate 90 degrees counter-clockwise
    rotated_t = t_img.rotate(90, expand=True)
    card.paste(rotated_t, (curr_x + (sw - rotated_t.width)//2, sy + 65), rotated_t)
    
    # Bottom year gold mark
    draw.line([(curr_x + 6, shelf_y - 28), (curr_x + sw - 6, shelf_y - 28)], fill=(245, 215, 110, 180), width=1)
    y_bbox = font_spine_sub.getbbox(year)
    yw = y_bbox[2] - y_bbox[0]
    draw.text((curr_x + (sw - yw)//2, shelf_y - 22), year, fill=(245, 215, 110), font=font_spine_sub)
    
    curr_x += sw + 4

# Save both PNG and high-quality JPG
os.makedirs('public', exist_ok=True)
card_rgb = card.convert('RGB')

# Save PNG
card.save('public/og-image.png', format='PNG', optimize=True)
card.save('public/opengraph-image.png', format='PNG', optimize=True)

# Save WhatsApp-optimized JPEG (quality 88 is stunning and ~140KB, well below the 300KB WhatsApp cap)
card_rgb.save('public/og-image.jpg', format='JPEG', quality=88, optimize=True)

png_size = os.path.getsize('public/og-image.png') / 1024
jpg_size = os.path.getsize('public/og-image.jpg') / 1024
print(f"Generated og-image.png: {png_size:.1f} KB")
print(f"Generated og-image.jpg: {jpg_size:.1f} KB")
