import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { UserAvatar } from './UserAvatar'
import { DropdownMenu } from 'radix-ui'
import { IconType } from 'react-icons/lib'
import { cloneElement, createElement } from 'react'
import { TbLogout, TbSettings, TbSmartHome } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { useLogout } from '@modules/auth/hooks/useLogout'

const MenuItem = ({
    children,
    onClick,
    icon,
    disabled = false
}: {
	children: React.ReactNode
	onClick?: () => void,
	icon?: IconType,
	disabled?: boolean
}) => {
    return (
        <DropdownMenu.Item
            className="cursor-pointer select-none flex items-center gap-3 rounded-[3px] px-5 h-14 text-sm leading-none outline-none focus:bg-gray-100 focus:text-gray-900 hover:bg-slate-100"
            onClick={ onClick }
            disabled={ disabled }
        >
            {
                icon && cloneElement(createElement(icon), {
                    className: 'w-6 h-6 text-gray-500'
                })
            }
            { children }
        </DropdownMenu.Item>
    )
}

export const NavbarUserMenu = () => {
    const user = useCurrentUser()
    const navigate = useNavigate()
    const { logout, isPending } = useLogout()

    return (
        <DropdownMenu.Root modal={ false }>
            <DropdownMenu.Trigger className="focus:outline-none rounded-full cursor-pointer">
                <UserAvatar
                    name={ user.name }
                    profilePhoto={ user.profilePhoto }
                />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[275px] mr-3 mt-3 rounded-xl bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden">
                    <div>
                        <div className="flex items-center gap-2 h-20 px-5">
                            <UserAvatar
                                name={ user.name }
                                profilePhoto={ user.profilePhoto }
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{ user.name }</span>
                                <span className="text-xs text-gray-500">{ user.email }</span>
                            </div>
                        </div>
                    </div>
                    <MenuItem
                        onClick={ () => navigate('/') }
                        icon={ TbSmartHome }
                    >
                        Home
                    </MenuItem>
                    <MenuItem
                        onClick={ () => navigate('/settings') }
                        icon={ TbSettings }
                    >
                        Settings
                    </MenuItem>
                    <MenuItem
                        onClick={ () => logout() }
                        icon={ TbLogout }
                        disabled={ isPending }
                    >
                        Logout
                    </MenuItem>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
