import { PasswordSecurityCard, SessionsSecurityCard, TwoFactorAuthSecurityCard } from '../components'


export const AccountSecurityPage = () => {
    return (
        <div className='max-w-screen-md mx-auto'>
            <div className='text-3xl mb-4'>
                Security
            </div>
            <div className='flex flex-col gap-5 mb-4'>
                <PasswordSecurityCard />
                <TwoFactorAuthSecurityCard />
                <SessionsSecurityCard />
            </div>
        </div>
    )
}
