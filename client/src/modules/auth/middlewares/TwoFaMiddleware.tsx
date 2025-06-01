import { ReactNode } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { FullWidthLayout } from '@shared/layouts/FullWidthLayout'
import { VerifyTwoFaForm } from '../components/forms/VerifyTwoFaForm'

export const TwoFaMiddleware = ({ children }: { children: ReactNode }) => {
    const user = useCurrentUser()

    if(user.twoFactorEnabled && !user.hasPassedTwoFactorAuth) {
        return (
            <FullWidthLayout>
                <div className='flex grow justify-center items-center'>
                    <div className='flex flex-col items-center'>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-4">Two-Factor Authentication Required</h1>
                            <p className="mb-4">Please verify your two-factor authentication to continue.</p>
                        </div>
                        <VerifyTwoFaForm />
                    </div>
                </div>
            </FullWidthLayout>
        )
    }

    return children
}
