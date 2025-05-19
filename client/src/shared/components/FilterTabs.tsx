interface TabProps {
	name: string
	onClick: () => void
	counter?: number
	isActive: boolean
}

const Tab = ({ name, onClick, counter, isActive }: TabProps) => {
    const buttonClasses = [
        'px-5',
        'py-2',
        'border-b-2',
        'transition-colors',
        isActive ? 'border-b border-primary' : 'border-transparent hover:border-gray-200'
    ].join(' ')

    return (
        <button
            className={ buttonClasses }
            onClick={ () => onClick() }
        >
            { name }
            { counter !== undefined && (
                <span className="ml-2">
                    { counter }
                </span>
            ) }
        </button>
    )
}

interface FilterTabsProps {
	tabs: TabProps[]
}

export const FilterTabs = ({ tabs }: FilterTabsProps) => {
    return (
        <div className='w-full'>
            <div className="flex w-full">
                { tabs.map((tab) => (
                    <Tab
                        key={ tab.name }
                        name={ tab.name }
                        onClick={ tab.onClick }
                        counter={ tab.counter }
                        isActive={ tab.isActive }
                    />
                )) }
            </div>
        </div>
    )
}