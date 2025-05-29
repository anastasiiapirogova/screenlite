import { ReactNode } from 'react'
import { Link } from 'react-router'

export const Header = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-16 border-neutral-200 flex items-center shrink-0">
            <div className='w-[275px] shrink-0 px-4'>
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
