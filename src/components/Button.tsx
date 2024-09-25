import React, { forwardRef } from 'react';
import { ButtonSizeClassNames, ButtonSizes, ButtonVariantClassNames, ButtonVariants } from '../types/ButtonVariants';

interface ButtonProps {
    id?: string;
    className?: string;
    name?: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: ButtonVariants;
    size?: ButtonSizes;
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => React.MouseEvent<HTMLButtonElement> | void | Promise<void>;
    onBlur?: () => void;
    onFocus?: () => void;
}

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    id,
    className = '',
    name,
    type = 'button',
    variant = ButtonVariants.Primary,
    size = ButtonSizes.md,
    children,
    disabled = false,
    onClick,
    onBlur,
    onFocus,
}, ref) => (
    <button
        id={id}
        ref={ref}
        className={classNames(
            'tw-px-4 tw-py-2 tw-font-medium tw-rounded tw-transition-colors tw-duration-200 tw-flex tw-gap-1 tw-items-center tw-select-none',
            ButtonVariantClassNames[variant],
            ButtonSizeClassNames[size],
            className,
            disabled ? 'tw-opacity-50 tw-cursor-not-allowed' : ''
        )}
        name={name}
        type={type}
        disabled={disabled}
        aria-disabled={disabled ? 'true' : 'false'}
        onClick={(e) => {
            if (onClick) {
                return onClick(e);
            }
        }}
        onBlur={onBlur}
        onFocus={onFocus}
    >
        {children}
    </button>
));

export default Button;
