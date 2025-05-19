import { TbSettings } from 'react-icons/tb'
import { useLocation } from 'react-router'

export const NavbarPageTitle = () => {
    const location = useLocation()

    if(location.pathname.startsWith('/settings')) {
        return (
            <div className='flex items-center gap-3'>
                <div
                    className="rounded-lg bg-gray-200 flex items-center justify-center"
                    style={ { width: 40, height: 40 } }
                >
                    <TbSettings className="w-5 h-5 text-neutral-500" />
                </div>
                <span className={ 'font-medium px-2 py-0.5 rounded-sm' }>
                    Settings
                </span>
            </div>
        )
    }
}
