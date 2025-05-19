import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { TbCheck } from 'react-icons/tb'
import { twMerge } from 'tailwind-merge'

interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
}

export const Checkbox = ({ id, label, checked, onChange, className }: CheckboxProps) => (
    <label
        className={
            twMerge(
                'flex items-stretch cursor-pointer',
                className
            )
        }
        htmlFor={ id }
    >
        <CheckboxPrimitive.Root
            className={
                twMerge(
                    'flex size-[20px] appearance-none items-center justify-center rounded-sm outline-hidden border',
                    checked ? 'border-primary bg-primary' : 'bg-white',
                )
            }
            id={ id }
            checked={ checked }
            onCheckedChange={ onChange }
        >
            <CheckboxPrimitive.Indicator className={
                twMerge(
                    checked ? 'text-white' : '',
                )
            }
            >
                <TbCheck className='w-4 h-4'/>
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <div className="pl-2 text-[15px] leading-none select-none flex items-center grow">
            { label }
        </div>
    </label>
)