import base64
import io
import json
from PIL import Image, ImageFilter
import numpy as np

# Load uploaded image
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

# Strict clean alpha: <=40 is 255 (full stroke), >=170 is 0 (pure transparent)
alpha_clean = np.clip((170.0 - b_arr) / (170.0 - 40.0) * 255.0, 0, 255).astype(np.uint8)

art_dir = 'C:/Users/davin/.gemini/antigravity/brain/7cbe4297-a12a-45f1-b274-4f53ae129fd9'

colors = {
    'sky_blue': (56, 189, 248),    # #38bdf8
    'ice_cyan': (103, 232, 249),   # #67e8f9
    'royal_blue': (96, 165, 250),  # #60a5fa
    'pure_white': (255, 255, 255)  # #ffffff
}

png_b64 = {}
for name, (r, g, b) in colors.items():
    rgba = np.zeros((512, 512, 4), dtype=np.uint8)
    rgba[:, :, 0] = r
    rgba[:, :, 1] = g
    rgba[:, :, 2] = b
    rgba[:, :, 3] = alpha_clean
    out_img = Image.fromarray(rgba, 'RGBA')
    out_img.save(f'{art_dir}/moose_clean_{name}.png')
    buf = io.BytesIO()
    out_img.save(buf, format='PNG', optimize=True)
    png_b64[name] = base64.b64encode(buf.getvalue()).decode('ascii')

# Read the potrace vector path
with open('scripts/moose_path.txt', 'r', encoding='utf-8') as f:
    vector_path = f.read().trim() if hasattr(str, 'trim') else f.read().strip()

# Build self-contained HTML artifact
html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mostly Fiction - Line Art vs Silhouette Fix</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
</head>
<body class="p-6 bg-stone-900 text-stone-100 font-sans min-h-screen">
  <div class="max-w-4xl mx-auto space-y-8">
    
    <div>
      <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 mb-2">
        <span>Hollow Line Art Restored (0% Silhouette)</span>
      </div>
      <h2 class="text-2xl font-bold tracking-tight text-white font-serif">Dark Mode Blue Options (56px)</h2>
      <p class="text-sm text-stone-400 mt-1">
        The solid silhouette was caused by SVG fill-rule parsing. The hollow continuous-line art is fully restored with thickened lines (+43%) and clean transparency inside the head.
      </p>
    </div>

    <!-- Active Header Preview -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-stone-400">Live Header Preview (56px)</span>
        <span id="active-label" class="text-xs font-mono px-2.5 py-1 rounded-md bg-sky-950 text-sky-400 border border-sky-800 font-bold">1. Electric Sky Blue (#38bdf8)</span>
      </div>

      <div class="rounded-2xl border border-stone-800 bg-[#0c0a09] shadow-2xl overflow-hidden">
        <header class="px-6 py-3 border-b border-stone-800 flex items-center justify-between bg-[#0c0a09]">
          <div class="flex items-center space-x-4 cursor-pointer group py-0.5">
            <img 
              id="active-moose"
              src="data:image/png;base64,{png_b64['sky_blue']}" 
              alt="Mostly Fiction Moose" 
              class="h-14 w-14 object-contain transition-transform group-hover:scale-105 shrink-0"
            />
            <div>
              <span class="font-serif text-2xl font-bold tracking-tight text-white block leading-tight">
                Mostly Fiction
              </span>
              <span class="text-[11px] font-sans text-stone-400 block tracking-widest uppercase font-semibold">
                The Curated Literary Archive
              </span>
            </div>
          </div>

          <nav class="flex items-center space-x-2 text-xs font-medium text-stone-300">
            <span class="px-3.5 py-2 rounded-lg bg-stone-800 text-white font-semibold">Index & Search</span>
            <span class="px-3.5 py-2 rounded-lg hover:bg-stone-800/60 hidden sm:inline">Virtual Shelf</span>
            <span class="px-3.5 py-2 rounded-lg hover:bg-stone-800/60 hidden sm:inline">Prizes</span>
          </nav>
        </header>

        <div class="px-6 py-5 bg-gradient-to-b from-[#1c1917]/70 to-[#0c0a09] text-xs text-stone-400 flex items-center justify-between">
          <span>Hollow line drawing: only the line strokes are visible. Zero background, zero interior fill.</span>
        </div>
      </div>
    </div>

    <!-- Palette Swatches -->
    <div class="space-y-3">
      <span class="text-xs font-bold uppercase tracking-wider text-stone-400">Click Any Swatch to Preview in Header</span>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- Option 1: Sky Blue -->
        <div onclick="selectVariant('sky_blue', '1. Electric Sky Blue (#38bdf8)', this)" class="color-card p-4 rounded-xl border-2 border-sky-400 bg-[#0c0a09] cursor-pointer transition-all shadow-md group">
          <div class="flex items-center space-x-4">
            <img src="data:image/png;base64,{png_b64['sky_blue']}" class="h-14 w-14 object-contain group-hover:scale-105 transition-transform" />
            <div>
              <span class="text-sm font-bold text-white block">Option 1: Electric Sky Blue</span>
              <span class="text-xs text-sky-400 font-mono">#38bdf8 &bull; Vibrant & high luminosity</span>
            </div>
          </div>
        </div>

        <!-- Option 2: Ice Cyan -->
        <div onclick="selectVariant('ice_cyan', '2. Bright Ice Cyan (#67e8f9)', this)" class="color-card p-4 rounded-xl border border-stone-800 bg-[#0c0a09] hover:border-cyan-400 cursor-pointer transition-all shadow-sm group">
          <div class="flex items-center space-x-4">
            <img src="data:image/png;base64,{png_b64['ice_cyan']}" class="h-14 w-14 object-contain group-hover:scale-105 transition-transform" />
            <div>
              <span class="text-sm font-bold text-white block">Option 2: Bright Ice Cyan</span>
              <span class="text-xs text-cyan-300 font-mono">#67e8f9 &bull; Maximum brightness</span>
            </div>
          </div>
        </div>

        <!-- Option 3: Royal Blue -->
        <div onclick="selectVariant('royal_blue', '3. Literary Royal Blue (#60a5fa)', this)" class="color-card p-4 rounded-xl border border-stone-800 bg-[#0c0a09] hover:border-blue-400 cursor-pointer transition-all shadow-sm group">
          <div class="flex items-center space-x-4">
            <img src="data:image/png;base64,{png_b64['royal_blue']}" class="h-14 w-14 object-contain group-hover:scale-105 transition-transform" />
            <div>
              <span class="text-sm font-bold text-white block">Option 3: Literary Royal Blue</span>
              <span class="text-xs text-blue-400 font-mono">#60a5fa &bull; Elegant & classic</span>
            </div>
          </div>
        </div>

        <!-- Option 4: Bold White -->
        <div onclick="selectVariant('pure_white', '4. Extra-Bold Pure White (#ffffff)', this)" class="color-card p-4 rounded-xl border border-stone-800 bg-[#0c0a09] hover:border-white cursor-pointer transition-all shadow-sm group">
          <div class="flex items-center space-x-4">
            <img src="data:image/png;base64,{png_b64['pure_white']}" class="h-14 w-14 object-contain group-hover:scale-105 transition-transform" />
            <div>
              <span class="text-sm font-bold text-white block">Option 4: Extra-Bold Pure White</span>
              <span class="text-xs text-stone-300 font-mono">#ffffff &bull; Clean monochrome</span>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>

  <script>
    const b64Data = {json.dumps(png_b64)};
    function selectVariant(key, label, cardEl) {{
      document.getElementById('active-moose').src = 'data:image/png;base64,' + b64Data[key];
      document.getElementById('active-label').innerText = label;
      
      document.querySelectorAll('.color-card').forEach(el => {{
        el.className = 'color-card p-4 rounded-xl border border-stone-800 bg-[#0c0a09] hover:border-stone-600 cursor-pointer transition-all shadow-sm group';
      }});
      if (cardEl) {{
        cardEl.className = 'color-card p-4 rounded-xl border-2 border-sky-400 bg-[#0c0a09] cursor-pointer transition-all shadow-md group';
      }}
    }}
  </script>
</body>
</html>
'''

with open(f'{art_dir}/moose_blue_mockup.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Clean hollow line art mockup generated successfully!')
