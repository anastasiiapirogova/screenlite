import { Logo } from '@shared/ui/Logo'
import { ReactNode } from 'react'
import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'

export const Header = ({ hasSidenav = true, children }: { hasSidenav?: boolean, children: ReactNode }) => {
    return (
        <div className={
            twMerge([
                'h-20 border-neutral-200 flex items-center shrink-0'
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
                    className='text-xl font-semibold px-3 flex items-center gap-3'
                >
                    <div className='bg-white p-1 rounded-xl'>
                        <Logo className='w-10 h-10'/>
                    </div>
                    <div>
                        Screenlite
                    </div>
                </Link>
            </div>
            <div className='flex grow pr-4'>
                { children }
            </div>
        </div>
    )
}
