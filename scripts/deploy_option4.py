import base64
import io
from PIL import Image, ImageFilter
import numpy as np

# Load uploaded image with thicker lines
img = Image.open('C:/Users/davin/.gemini/antigravity/brain/7cbe4297-a12a-45f1-b274-4f53ae129fd9/.user_uploaded/media_1795316162571_25af3f18.jpg').convert('L')
arr = np.array(img)
coords = np.argwhere(arr < 150)
ymin, xmin = coords.min(axis=0)
ymax, xmax = coords.max(axis=0)

cx = (xmin + xmax) / 2
cy = (ymin + ymax) / 2
size = int(max(xmax - xmin, ymax - ymin) * 1.05)

crop_x0 = int(cx - size / 2)
crop_y0 = int(cy - size / 2)
crop_x1 = crop_x0 + size
crop_y1 = crop_y0 + size

cropped = img.crop((crop_x0, crop_y0, crop_x1, crop_y1)).resize((512, 512), Image.Resampling.LANCZOS)
bolder = cropped.filter(ImageFilter.MinFilter(3))
b_arr = np.array(bolder).astype(float)

# Clean hollow line art alpha:
# <= 40 -> 255 (opaque line)
# >= 170 -> 0 (clean transparent background / hollow inside face)
alpha_clean = np.clip((170.0 - b_arr) / (170.0 - 40.0) * 255.0, 0, 255).astype(np.uint8)

# 1. Dark ink on transparent (Light mode: #1c1917)
rgba_dark = np.zeros((512, 512, 4), dtype=np.uint8)
rgba_dark[:, :, 0] = 28 # stone-900
rgba_dark[:, :, 1] = 25
rgba_dark[:, :, 2] = 23
rgba_dark[:, :, 3] = alpha_clean
img_dark = Image.fromarray(rgba_dark, 'RGBA')
img_dark.save('public/moose.png')
img_dark.save('src/app/icon.png')
img_dark.resize((192, 192), Image.Resampling.LANCZOS).save('public/moose-192.png')
img_dark.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32.png')

# 2. Pure White on transparent (Dark mode: #ffffff - Option 4)
rgba_white = np.zeros((512, 512, 4), dtype=np.uint8)
rgba_white[:, :, 0] = 255
rgba_white[:, :, 1] = 255
rgba_white[:, :, 2] = 255
rgba_white[:, :, 3] = alpha_clean
img_white = Image.fromarray(rgba_white, 'RGBA')
img_white.save('public/moose-white.png')

# 3. Base64 encode for embedding
buf_dark = io.BytesIO()
img_dark.save(buf_dark, format='PNG', optimize=True)
dark_b64 = base64.b64encode(buf_dark.getvalue()).decode('ascii')

buf_white = io.BytesIO()
img_white.save(buf_white, format='PNG', optimize=True)
white_b64 = base64.b64encode(buf_white.getvalue()).decode('ascii')

# 4. Adaptive SVG favicon (supports dark/light mode in browser tabs)
svg_favicon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <style>
    .light-moose {{ display: block; }}
    .dark-moose {{ display: none; }}
    @media (prefers-color-scheme: dark) {{
      .light-moose {{ display: none; }}
      .dark-moose {{ display: block; }}
    }}
  </style>
  <image class="light-moose" href="data:image/png;base64,{dark_b64}" width="512" height="512" />
  <image class="dark-moose" href="data:image/png;base64,{white_b64}" width="512" height="512" />
</svg>'''

with open('src/app/icon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_favicon)

with open('public/moose.svg', 'w', encoding='utf-8') as f:
    f.write(svg_favicon)

print('Successfully generated Option 4 master assets!')
