import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { RadioItem } from './RadioItem'

type Option<T> = {
    value: T
    label: string
    description?: string 
}

type Props<T> = {
    options: Option<T>[];
    value: T;
    ariaLabel: string;
    onChange: (value: T) => void;
}

const generateId = (value: string, label: string) => `${value}-${label.replace(/\s+/g, '-').toLowerCase()}`

export const RadioGroup = <T extends string>({ options, value, ariaLabel, onChange }: Props<T>) => {
    return (
        <RadioGroupPrimitive.Root
            className="flex flex-col"
            value={ value }
            aria-label={ ariaLabel }
            onValueChange={ onChange }
        >
            { options.map(option => (
                <RadioItem
                    key={ generateId(option.value, option.label) }
                    value={ option.value }
                    label={ option.label }
                    id={ generateId(option.value, option.label) }
                    isChecked={ value === option.value }
                />
            )) }
        </RadioGroupPrimitive.Root>
    )
}