import base64

with open('C:/Users/davin/.gemini/antigravity/brain/7cbe4297-a12a-45f1-b274-4f53ae129fd9/moose_light.png', 'rb') as f:
    light_b64 = base64.b64encode(f.read()).decode('ascii')

with open('C:/Users/davin/.gemini/antigravity/brain/7cbe4297-a12a-45f1-b274-4f53ae129fd9/moose_dark.png', 'rb') as f:
    dark_b64 = base64.b64encode(f.read()).decode('ascii')

html_path = 'C:/Users/davin/.gemini/antigravity/brain/7cbe4297-a12a-45f1-b274-4f53ae129fd9/moose_header_mockup.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('src="moose_light.png"', f'src="data:image/png;base64,{light_b64}"')
content = content.replace('src="moose_dark.png"', f'src="data:image/png;base64,{dark_b64}"')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated moose_header_mockup.html with inline base64 images!')
