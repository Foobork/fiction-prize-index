import React from 'react';

interface MooseIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

/**
 * Mostly Fiction Moose Icon
 * - Light mode: Dark ink line art on warm parchment
 * - Dark mode: Pure white line art on deep obsidian (Option 4)
 * - 56px scale, unboxed without container borders
 */
export const MooseIcon: React.FC<MooseIconProps> = ({ className = 'w-14 h-14', ...props }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <span className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Light mode: dark ink line art */}
      <img
        src={`${basePath}/moose.png`}
        alt="Mostly Fiction Moose"
        className="w-full h-full object-contain block dark:hidden"
        {...props}
      />
      {/* Dark mode: pure white line art (Option 4) */}
      <img
        src={`${basePath}/moose-white.png`}
        alt="Mostly Fiction Moose"
        className="w-full h-full object-contain hidden dark:block"
        {...props}
      />
    </span>
  );
};
