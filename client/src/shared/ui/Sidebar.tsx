import { ReactNode } from 'react'
import { IconType } from 'react-icons/lib'
import { Link, useLocation } from 'react-router'

export const Sidebar = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-64 bg-neutral-50 pt-0 px-3 flex flex-col shrink-0 sticky h-screen top-0 left-0">
            <div className='flex items-center h-10 my-5 font-semibold'>
                <Link to="/">Screenlite</Link>
            </div>
            { children }
        </div>
    )
}

export const SidebarItemsGroup = ({ children }: { children: ReactNode }) => {
    return (
        <div className='flex flex-col gap-1'>
            { children }
        </div>
    )
}

type SidebarItemProps = {
	text?: string
	icon?: IconType
	counter?: number
	as?: ReactNode
	to?: string
}

const renderIcon = (IconComponent?: IconType, className?: string) => {
    return IconComponent ? (
        <IconComponent className={ [
            className,
            'w-6 h-6'
        ].join(' ') }
        />
    ) : null
}

const renderText = (text?: string) => {
    return text ? (
        <span>
            { text }
        </span>
    ) : null
}

const renderCounter = (counter?: number) => {
    return counter !== undefined ? (
        <div>
            { counter }
        </div>
    ) : null
}

export const SidebarItem = ({ text, icon, counter, as, to }: SidebarItemProps) => {
    const location = useLocation()

    if (as) {
        return as
    }

    const isActive = to && location.pathname === to

    const Component = to ? Link : 'div'

    return (
        <Component
            to={ to ?? '#' }
            className={ [
                'flex items-center justify-between gap-3 h-8 px-3 transition-colors text-sm',
                isActive ? 'text-black font-semibold bg-neutral-100' : 'hover:bg-neutral-100 text-neutral-500'
            ].join(' ') }
            draggable={ false }
        >
            <div className='flex items-center gap-3'>
                { renderIcon(icon) }
                { renderText(text) }
            </div>
            { renderCounter(counter) }
        </Component>
    )
}