'use client'
// components/Button.tsx

import React, { useState } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'text' | 'outlined' | 'contained' | 'none';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonColor = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    color?: ButtonColor;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'none',
    size = 'medium',
    color = 'primary',
    disabled = false,
    fullWidth = false,
    className,
    ...props
}) => {
    const [ripple, setRipple] = useState<{ x: number; y: number; size: number } | null>(null);

    const baseStyles = 'font-medium focus:outline-none rounded transition ease-in-out duration-300 relative overflow-hidden flex items-center justify-center';

    const variantStyles = {
        none: '',
        text: 'bg-transparent hover:bg-opacity-10',
        outlined: `border border-current hover:bg-opacity-10`,
        contained: 'text-white',
    };

    const sizeStyles = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-8 py-3 text-lg',
    };

    const colorStyles = {
        primary: 'bg-blue-500 text-white ',
        secondary: 'bg-gray-500 text-white ',
        danger: 'bg-red-500 text-white',
        success: 'bg-green-500 text-white h',
    };

    const disabledStyles = 'opacity-50 cursor-not-allowed';

    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        setRipple({ x, y, size });

        setTimeout(() => setRipple(null), 240);
    };

    const classes = clsx(
        baseStyles,
        sizeStyles[size],
        variant === 'contained' ? colorStyles[color] : '',
        variant === 'outlined' ? `text-${color} border-${color}` : '',
        variant === 'text' ? `text-${color}` : '',
        fullWidth && 'w-full',
        disabled && disabledStyles,
        className
    );

    return (
        <button className={classes} disabled={disabled} onClick={(e) => !disabled && handleRipple(e)} {...props}>
            {ripple && (
                <span
                    className="absolute bg-white opacity-30 rounded-full"
                    style={{
                        width: ripple.size,
                        height: ripple.size,
                        top: ripple.y,
                        left: ripple.x,
                        transform: 'scale(1)',
                        animation: 'ripple 0.5s linear',
                    }}
                ></span>
            )}
            {children}
            <style jsx>{`
        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 0.5;
          }
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
        </button>
    );
};

export default Button;
