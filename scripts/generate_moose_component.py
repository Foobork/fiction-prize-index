import base64

with open('public/moose.png', 'rb') as f:
    dark_b64 = base64.b64encode(f.read()).decode('ascii')

# For the mask:
with open('public/moose.svg', 'r', encoding='utf-8') as f:
    svg_txt = f.read()

import re
m = re.search(r'data:image/png;base64,([a-zA-Z0-9+/=]+)', svg_txt)
mask_b64 = m.group(1) if m else ''

component_code = f'''import React, {{ useId }} from 'react';

interface MooseIconProps extends React.SVGProps<SVGSVGElement> {{
  className?: string;
}}

/**
 * Mostly Fiction Moose Icon
 * Based on user-uploaded continuous-line drawing.
 * Supports Tailwind currentColor (text-stone-900, dark:text-amber-300, etc.)
 */
export const MooseIcon: React.FC<MooseIconProps> = ({{ className = 'w-6 h-6', ...props }}) => {{
  const rawId = useId();
  const maskId = `moose-mask-${{rawId.replace(/:/g, '')}}`;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={{className}}
      aria-label="Mostly Fiction Moose"
      {{...props}}
    >
      <defs>
        <mask id={{maskId}} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
          <image
            href="data:image/png;base64,{mask_b64}"
            width="512"
            height="512"
          />
        </mask>
      </defs>
      <rect width="512" height="512" fill="currentColor" mask={{`url(#${{maskId}})`}} />
    </svg>
  );
}};
'''

with open('src/components/MooseIcon.tsx', 'w', encoding='utf-8') as f:
    f.write(component_code)

print('Updated src/components/MooseIcon.tsx')
