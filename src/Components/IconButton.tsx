import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'primary' | 'secondary' | 'none';
    rounded?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
    children,
    size = 'medium',
    variant = 'none',
    rounded = false,
    className = '',
    ...props
}) => {
    const sizeClasses = {
        small: 'w-8 h-8 text-sm',
        medium: 'w-10 h-10 text-base',
        large: 'w-12 h-12 text-lg',
    };

    const variantClasses = {
        none: '',
        default: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    };

    const baseClasses = `flex items-center justify-center focus:outline-none transition-all duration-200 rounded-full`;

    return (
        <button
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${rounded ? 'rounded-full' : 'rounded'
                } ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default IconButton;
