import { EmailVerificationTokenRepository } from '@/modules/emailVerificationToken/repositories/EmailVerificationTokenRepository.ts'
import { sendVerificationEmail } from '@/modules/user/utils/sendVerificationEmail.ts'
import { User } from '@/generated/prisma/client.ts'

export const handleUserSignedUpJob = async (user: User) => {
    try {
        const pendingToken = await EmailVerificationTokenRepository.getPendingEmailVerificationToken(user.id)

        let token

        if (pendingToken) {
            token = pendingToken.token
        } else {
            const newToken = await EmailVerificationTokenRepository.createEmailVerificationToken(user.id, user.email)

            token = newToken.token
        }

        if (token) {
            await sendVerificationEmail(user.email, token)
        }
    } catch (error) {
        console.error('Error handling userSignedUp event:', error)
    }
}
