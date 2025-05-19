import { NavLink } from 'react-router'
import { twMerge } from 'tailwind-merge'

export type NavbarMenuItem = {
    title: string
    to: string
}

export const NavbarMenu = ({ menuItems }: { menuItems: NavbarMenuItem[] }) => {
    return (
        <div className="flex space-x-4 select-none">
            {
                menuItems.map((menuItem) => (
                    <NavLink
                        end
                        key={ menuItem.to }
                        to={ menuItem.to }
                        className={ ({ isActive }) => (
                            twMerge([
                                'bg-transparent px-3 py-1 rounded-md transition-colors font-medium',
                                isActive && 'bg-blue-50 text-blue-600',
                                !isActive && 'text-neutral-500 hover:hover:bg-neutral-100',
                            ])
                        ) }
                        draggable={ false }
                    >
                        { menuItem.title }
                    </NavLink>
                ))
            }
        </div>
    )
}
