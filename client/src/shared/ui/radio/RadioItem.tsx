import { RadioGroup } from 'radix-ui'
import { twMerge } from 'tailwind-merge'

type Props = {
    id: string;
    value: string;
    label: string;
    description?: string;
    isChecked: boolean;
}

export const RadioItem = ({ value, label, id, description, isChecked }: Props) => {
    return (
        <label
            className={
                twMerge(
                    'flex items-center p-2.5 transition-colors cursor-pointer',
                )
            }
            htmlFor={ id }
        >
            <RadioGroup.Item
                className={
                    twMerge(
                        'size-[24px] cursor-default rounded-full outline-hidden border-2 bg-neutral-100 shrink-0',
                        isChecked ? 'border-primary bg-primary' : 'border-gray-200'
                    )
                }
                value={ value }
                id={ id }
            >
                <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[8px] after:rounded-full after:bg-white" />
            </RadioGroup.Item>
            <span className="pl-[15px] w-full">
                <span className={
                    twMerge(
                        'text-[15px] leading-none',
                    )
                }
                >
                    { label }
                </span>
                { description && (
                    <p className="text-[12px] text-gray-400">{ description }</p>
                ) }
            </span>
        </label>
    )
}