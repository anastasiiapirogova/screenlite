import { Outlet } from 'react-router'
import { useScreen } from '../hooks/useScreen'

export const WorkspaceScreenLayout = () => {
    const screen = useScreen()

    return (
        <div className='max-w-(--breakpoint-xl) mx-auto w-full'>
            { screen.name }
            <Outlet />
        </div>
    )
}
