import { bullmqConnection } from '@/config/bullmq.ts'
import { mailQueue } from '@/bullmq/queues/mailQueue.ts'
import { MailService } from '@/services/mail/MailService.ts'
import { createWorkerProcessor } from './workerFactory.ts'
import { Job, Worker } from 'bullmq'
import { VerificationEmailData } from '@/services/mail/templates/VerificationEmailTemplate.ts'
import { WorkspaceInvitationEmailData } from '@/services/mail/templates/WorkspaceInvitationEmailTemplate.ts'
import { PasswordResetEmailData } from '@/services/mail/templates/PasswordResetEmailTemplate.ts'

export type MailJobData = VerificationEmailData | WorkspaceInvitationEmailData | PasswordResetEmailData

const mailService = MailService.getInstance()

const handlers: Record<string, (job: Job<MailJobData>) => Promise<void>> = {
    verification: async (job) => {
        const mailData = job.data as VerificationEmailData
        
        await mailService.sendVerificationEmail(mailData)
    },
    workspaceInvitation: async (job) => {
        const mailData = job.data as WorkspaceInvitationEmailData
        
        await mailService.sendWorkspaceInvitationEmail(mailData)
    },
    passwordReset: async (job) => {
        const mailData = job.data as PasswordResetEmailData
        
        await mailService.sendPasswordResetEmail(mailData)
    }
}

const processor = createWorkerProcessor<MailJobData>({
    handlers,
    category: 'mailQueueWorker',
    getLogContext: (job) => `to: ${job.data.email}, type: ${job.name}`
})

export const mailQueueWorker = new Worker(
    mailQueue.name,
    processor,
    {
        connection: bullmqConnection,
    }
) 