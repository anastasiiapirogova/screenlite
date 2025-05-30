import { SessionsSecurityCard } from '../components'
import { PasswordSecurityCard } from '../components/PasswordSecurityCard'

export const AccountSecurityPage = () => {
    return (
        <div className='max-w-screen-md mx-auto'>
            <div className='text-3xl mb-4'>
                Security
            </div>
            <div className='flex flex-col gap-2 mb-4'>
                <PasswordSecurityCard />
                <SessionsSecurityCard />
            </div>
        </div>
    )
}
