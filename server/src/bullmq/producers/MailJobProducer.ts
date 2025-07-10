import { mailQueue } from '@/bullmq/queues/mailQueue.ts'
import { PasswordResetEmailData } from '@/services/mail/templates/PasswordResetEmailTemplate.ts'
import { VerificationEmailData } from '@/services/mail/templates/VerificationEmailTemplate.ts'
import { WorkspaceInvitationEmailData } from '@/services/mail/templates/WorkspaceInvitationEmailTemplate.ts'

export class MailJobProducer {
    static async queueVerificationEmail(data: VerificationEmailData): Promise<void> {
        await mailQueue.add('verification', data)
    }

    static async queueWorkspaceInvitationEmail(data: WorkspaceInvitationEmailData): Promise<void> {
        await mailQueue.add('workspaceInvitation', data)
    }

    static async queuePasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
        await mailQueue.add('passwordReset', data)
    }
} 