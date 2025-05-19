import React from 'react'
import { twMerge } from 'tailwind-merge'

type TextareaProps = {
    size?: 'small' | 'base' | 'large'
    color?: keyof typeof colorStyles
    variant?: 'outline' | 'solid' | 'ghost';
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>

const baseStyles = 'rounded-sm focus:outline-hidden w-full'

const sizeStyles: { [key: string]: string } = {
    large: 'px-6 py-3 text-lg',
    base: 'px-4 py-2 text-base',
    small: 'px-2 py-1 text-sm',
}

const colorStyles: { [key: string]: string } = {
    primary: 'bg-white border border-neutral-200 text-neutral-900',
}

export const Textarea = ({
    size = 'base',
    color = 'primary',
    className = '',
    ...props
}: TextareaProps) => {
    const combinedStyles = twMerge(
        baseStyles,
        sizeStyles[size],
        colorStyles[color],
        className
    )

    return (
        <textarea
            className={ combinedStyles }
            { ...props }
        />
    )
}