import { ReactNode } from 'react'
import { TbExclamationCircle } from 'react-icons/tb'
import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'

type Props = {
    children: ReactNode
    title: string
    to?: string
    actionName?: string
    warning?: boolean
    onClick?: () => void
    className?: string
}

export const EntityPageCard = ({ children, title, to, actionName, warning = false, onClick, className }: Props) => {
    const Component = to ? Link : 'div'

    return (
        <Component
            { ...(to ? { to } : { to: '' }) }
            onClick={ onClick }
            className={ twMerge(
                'p-6 rounded-2xl group flex flex-col border',
                onClick && 'cursor-pointer',
                className
            ) }
        >
            <div className="flex items-center gap-2 font-medium text-lg">
                <div className={
                    twMerge(
                        'text-neutral-800'
                    )
                }
                >
                    { title }
                </div>
                {
                    warning && (
                        <div>
                            <TbExclamationCircle className='w-5 h-5 text-orange-400'/>
                        </div>
                    )
                }
            </div>
            { children }
            {
                actionName && (
                    <span className='group-hover:text-blue-600 transition-colors text-neutral-400'>
                        { actionName }
                    </span>
                )
            }
        </Component>
    )
}
