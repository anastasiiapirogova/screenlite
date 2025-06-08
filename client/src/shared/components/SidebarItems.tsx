import { cloneElement, createElement } from 'react'
import { NavLink, useLocation } from 'react-router'
import { TbChevronDown } from 'react-icons/tb'
import { IconType } from 'react-icons/lib'
import { Accordion } from 'radix-ui'
import { twMerge } from 'tailwind-merge'

type BaseItem = {
    title: string
    icon?: IconType
}

type LinkItem = BaseItem & {
    to: string
}

type SidebarItem = BaseItem & {
    children?: LinkItem[]
    to?: string
}

const SidebarGroupItem = ({ title, icon, children }: SidebarItem) => {
    const location = useLocation()

    const isAnyChildActive = children?.some(child => location.pathname === child.to)

    return (
        <Accordion.Root
            className='flex flex-col w-full gap-2'
            type="single"
            defaultValue={ isAnyChildActive ? title : undefined }
            collapsible
        >
            <Accordion.Item value={ title }>
                <Accordion.Header>
                    <Accordion.Trigger className={ twMerge(
                        'flex items-center gap-2 px-5 py-2 text-gray-600 rounded-full w-full justify-between transition-colors hover:bg-slate-200 cursor-pointer group',
                    ) }
                    >
                        <div className='flex items-center'>
                            {
                                icon && cloneElement(createElement(icon), {
                                    className: 'w-5 h-5 mr-2'
                                })
                            }
                            { title }
                        </div>
                        <TbChevronDown className='w-5 h-5 transform group-data-[state=open]:rotate-180 transition-transform text-gray-400' />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className={ twMerge(
                    'overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown',
                ) }
                >
                    <div className='border-l-2 ml-5 pl-3 my-1 border-gray-300 flex flex-col gap-1'>
                        {
                            children?.map((item => {
                                const { title, to } = item

                                return (
                                    <SidebarLinkItem 
                                        key={ title }
                                        title={ title }
                                        to={ to! }
                                    />
                                )
                            }
                            ))
                        }
                    </div>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    )
}

const SidebarLinkItem = ({ to, icon, title }: LinkItem) => {
    return (
        <NavLink
            to={ to }
            className={
                ({ isActive }) => (
                    twMerge(
                        [
                            'flex items-center gap-2 px-5 py-2 text-gray-600 rounded-full transition-colors',
                            isActive ? 'bg-slate-200 text-gray-700' : 'hover:bg-slate-200'
                        ]
                    )
                )
            }
            end
        >
            {
                icon && cloneElement(createElement(icon), {
                    className: 'w-5 h-5'
                })
            }
            { title }
        </NavLink>
    )
}

export const SidebarItems = ({ items }: { items: SidebarItem[] }) => {
    return (
        <div className="flex flex-col gap-1">
            {
                items.map((item) => {
                    const { title, to, icon, children } = item

                    return (
                        <div key={ title }>
                            { to && (
                                <SidebarLinkItem
                                    title={ title }
                                    to={ to }
                                    icon={ icon }
                                />
                            ) }
                            { children && (
                                <SidebarGroupItem
                                    title={ title }
                                    children={ children }
                                    icon={ icon }
                                />
                            ) }
                        </div>
                    )
                })
            }
        </div>
    )
}