import { useState } from 'react'
import { useFloating, offset, flip, shift, useInteractions, useClick, useDismiss } from '@floating-ui/react'
import { TbChevronDown } from 'react-icons/tb'

type Option = {
	name: string
	onClick: () => void
	counter?: number
	isActive: boolean
}

type FilterDropdownProps = {
	options: Option[]
	menuButtonClass?: string
}

export const FilterDropdown = ({ options, menuButtonClass }: FilterDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false)
	
    const activeOption = options.find(option => option.isActive)

    const { x, y, refs, strategy, context } = useFloating({
        open: isOpen,
        placement: 'bottom-start',
        strategy: 'fixed',
        onOpenChange: setIsOpen,
        middleware: [offset(5), flip(), shift()],
    })

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useClick(context),
        useDismiss(context),
    ])

    return (
        <div>
            <button
                ref={ refs.setReference }
                { ...getReferenceProps({
                    className: [
                        'shrink-0 inline-flex h-10 items-center justify-between gap-2 rounded-md ring-1 ring-inset ring-gray-200 hover:bg-gray-100 hover:text-gray-900 hover:ring-transparent px-3 text-sm font-semibold focus:outline-hidden open:bg-neutral-200 focus:outline-1 focus:outline-white min-w-0 transition duration-200 ease-out',
                        menuButtonClass
                    ].join(' '),
                    onClick: () => setIsOpen(!isOpen),
                }) }
            >
                <div className='truncate'>
                    { activeOption ? activeOption.name : 'Options' }
                </div>
                <TbChevronDown className="size-4" />
            </button>
            { isOpen && (
                <div
                    ref={ refs.setFloating }
                    style={ { position: strategy, top: y ?? 0, left: x ?? 0 } }
                    { ...getFloatingProps({
                        className: 'shadow-md w-52 origin-top-left flex flex-col rounded-xl bg-white border border-white/5 p-1 text-sm/6 transition duration-100 ease-out gap-1',
                    }) }
                >
                    { options.map((option, index) => (
                        <button
                            key={ index }
                            className={ `group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 ${option.isActive ? 'bg-neutral-100' : 'bg-white hover:bg-neutral-100'}` }
                            onClick={ () => {
                                option.onClick()
                                setIsOpen(false)
                            } }
                        >
                            { option.name }
                        </button>
                    )) }
                </div>
            ) }
        </div>
    )
}
