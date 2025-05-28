import { Outlet } from 'react-router'

export const AuthLayout = () => {
    return (
        <div>
            <div
                className='min-h-screen min-w-full flex items-center justify-center'
            >
                <Outlet />
            </div>
        </div>
    )
}
