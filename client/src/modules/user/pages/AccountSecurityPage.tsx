import { SessionsSecurityCard } from '../components'

export const AccountSecurityPage = () => {
    return (
        <div className='max-w-screen-md mx-auto'>
            <div className='text-3xl mb-4'>
                Security
            </div>
            <div className='flex flex-col gap-2 mb-4'>
                <SessionsSecurityCard />
            </div>
        </div>
    )
}
