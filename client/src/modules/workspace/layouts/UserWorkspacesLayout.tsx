import { Outlet } from 'react-router'
import { UserWorkspacesHeader } from '../components/UserWorkspacesHeader'

export const UserWorkspacesLayout = () => {
    return (
        <div className='flex flex-col grow w-full bg-gray-100'>
            <UserWorkspacesHeader />
            <div className='flex grow items-center justify-center'>
                <Outlet />
            </div>
        </div>
    )
}
