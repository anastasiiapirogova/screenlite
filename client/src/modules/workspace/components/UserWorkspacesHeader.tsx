import { Logo } from '@shared/ui/Logo'

export const UserWorkspacesHeader = () => {
    return (
        <header className="h-12 flex items-center justify-between px-5 fixed top-0 bg-white w-full border-b">
            <div>
                <Logo className='w-10 h-10'/>
            </div>
            <div>
            </div>
        </header>
    )
}
