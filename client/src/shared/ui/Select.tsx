import React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { TbCheck, TbChevronDown, TbChevronUp } from 'react-icons/tb'

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
	children: React.ReactNode
	className?: string
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, className, ...props }, forwardedRef) => {
        return (
            <SelectPrimitive.Item
                className={ [
                    'relative flex py-2 select-none items-center rounded-[3px] pl-[25px] pr-[35px] leading-none text-violet11 data-disabled:pointer-events-none data-highlighted:bg-neutral-100 data-disabled:text-mauve8 data-highlighted:text-violet1 data-highlighted:outline-hidden',
                    className,
                ].join(' ') }
                { ...props }
                ref={ forwardedRef }
            >
                <SelectPrimitive.ItemText>{ children }</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                    <TbCheck />
                </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>
        )
    },
)

interface SelectProps<T> {
	options: { value: T, label: string }[]
	placeholder?: string
	ariaLabel?: string
	value?: T
	onChange?: (value: T) => void
}

export const Select = <T extends string>({ options, placeholder = 'Select an option…', ariaLabel = 'Select', value, onChange }: SelectProps<T>) => (
    <SelectPrimitive.Root
        value={ value }
        onValueChange={ onChange }
    >
        <SelectPrimitive.Trigger
            className="inline-flex h-10 border items-center justify-between gap-[5px] rounded-sm bg-white px-[15px] leading-none text-violet11 outline-hidden hover:bg-neutral-100 transition-colors"
            aria-label={ ariaLabel }
        >
            <SelectPrimitive.Value placeholder={ placeholder } />
            <SelectPrimitive.Icon className="text-violet11">
                <TbChevronDown />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                <SelectPrimitive.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-violet11">
                    <TbChevronUp />
                </SelectPrimitive.ScrollUpButton>
                <SelectPrimitive.Viewport className="p-[5px]">
                    <SelectPrimitive.Group>
                        { options.map((option) => (
                            <SelectItem
                                key={ option.value }
                                value={ option.value }
                            >
                                { option.label }
                            </SelectItem>
                        )) }
                    </SelectPrimitive.Group>
                </SelectPrimitive.Viewport>
                <SelectPrimitive.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-violet11">
                    <TbChevronDown />
                </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
)