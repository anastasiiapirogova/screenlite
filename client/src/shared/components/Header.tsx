import { ReactNode } from 'react'
import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'

export const Header = ({ hasSidenav = true, children }: { hasSidenav?: boolean, children: ReactNode }) => {
    return (
        <div className={
            twMerge([
                'h-16 border-neutral-200 flex items-center shrink-0'
            ]) }
        >
            <div className={
                twMerge([
                    'flex items-center gap-4 px-4',
                    hasSidenav ? 'w-[275px]' : 'w-auto'
                ])
            }
            >
                <Link
                    to="/"
                    className='text-2xl font-bold text-gray-800 hover:text-gray-900 transition-colors'
                >
                    Screenlite
                </Link>
            </div>
            <div className='flex grow pr-4'>
                { children }
            </div>
        </div>
    )
}
