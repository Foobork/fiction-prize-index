import base64
import io
from PIL import Image
import numpy as np

img = Image.open('C:/Users/davin/.gemini/antigravity/brain/7cbe4297-a12a-45f1-b274-4f53ae129fd9/.user_uploaded/media_1795315534727_9bd23791.png').convert('L')
arr = np.array(img)

coords = np.argwhere(arr < 240)
ymin, xmin = coords.min(axis=0)
ymax, xmax = coords.max(axis=0)

cx = (xmin + xmax) / 2
cy = (ymin + ymax) / 2
size = int(max(xmax - xmin, ymax - ymin) * 1.08)

crop_x0 = int(cx - size / 2)
crop_y0 = int(cy - size / 2)
crop_x1 = crop_x0 + size
crop_y1 = crop_y0 + size

cropped = img.crop((crop_x0, crop_y0, crop_x1, crop_y1)).resize((512, 512), Image.Resampling.LANCZOS)
c_arr = np.array(cropped)

# Line intensity: 255 for black line, 0 for white background
line_val = 255 - c_arr
line_val = np.clip(line_val.astype(float) * 1.25, 0, 255).astype(np.uint8)

# 1. Dark ink on transparent
rgba_dark = np.zeros((512, 512, 4), dtype=np.uint8)
rgba_dark[:, :, 0] = 28 # stone-900
rgba_dark[:, :, 1] = 25
rgba_dark[:, :, 2] = 23
rgba_dark[:, :, 3] = line_val
img_dark = Image.fromarray(rgba_dark, 'RGBA')
img_dark.save('public/moose.png')
img_dark.save('src/app/icon.png')
img_dark.resize((192, 192), Image.Resampling.LANCZOS).save('public/moose-192.png')
img_dark.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32.png')

# 2. Mask image
mask_img = Image.fromarray(line_val, 'L')
buf = io.BytesIO()
mask_img.save(buf, format='PNG', optimize=True)
mask_b64 = base64.b64encode(buf.getvalue()).decode('ascii')

buf_dark = io.BytesIO()
img_dark.save(buf_dark, format='PNG', optimize=True)
dark_b64 = base64.b64encode(buf_dark.getvalue()).decode('ascii')

# SVG with currentColor mask
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <mask id="moose-line-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
      <image href="data:image/png;base64,{mask_b64}" width="512" height="512" />
    </mask>
  </defs>
  <rect width="512" height="512" fill="currentColor" mask="url(#moose-line-mask)" />
</svg>'''

with open('public/moose.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

# Favicon SVG: adaptive color based on system light/dark scheme
svg_favicon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <style>
    :root {{ color: #1c1917; }}
    @media (prefers-color-scheme: dark) {{
      :root {{ color: #fbbf24; }}
    }}
  </style>
  <defs>
    <mask id="moose-fav-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
      <image href="data:image/png;base64,{mask_b64}" width="512" height="512" />
    </mask>
  </defs>
  <rect width="512" height="512" fill="currentColor" mask="url(#moose-fav-mask)" />
</svg>'''

with open('src/app/icon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_favicon)

print('Done! Mask size:', len(mask_b64), 'Dark size:', len(dark_b64))
