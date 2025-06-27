import { deviceQueue } from '@/bullmq/queues/deviceQueue.ts'

export const addSendNewStateToDeviceJob = async (token: string) => {
    await deviceQueue.add(
        'sendNewStateToDevice',
        { token },
        {
            deduplication: { id: token },
        },
    )
}