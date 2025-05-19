import { NavLink } from 'react-router'
import { twMerge } from 'tailwind-merge'

interface TabProps {
	name: string
	to: string
	counter?: number
}

const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    twMerge(
        'px-4 py-1 rounded-full font-medium transition-colors',
        isActive ? 'bg-neutral-100 text-black' : 'text-neutral-400 hover:bg-gray-100'
    )

const Tab = ({ name, to, counter }: TabProps) => {
    return (
        <NavLink
            to={ to }
            className={ navLinkClasses }
            replace={ true }
            end
        >
            { name }
            { counter !== undefined && (
                <span className="ml-2">
                    { counter }
                </span>
            ) }
        </NavLink>
    )
}

interface PageTabsProps {
	tabs: TabProps[]
}

export const PageTabs = ({ tabs }: PageTabsProps) => {
    return (
        <div className="flex gap-2">
            { tabs.map((tab) => (
                <Tab
                    key={ tab.name }
                    name={ tab.name }
                    to={ tab.to }
                    counter={ tab.counter }
                />
            )) }
        </div>
    )
}