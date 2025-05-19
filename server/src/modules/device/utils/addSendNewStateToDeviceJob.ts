import { deviceQueue } from 'bullmq/queues/deviceQueue.js'

export const addSendNewStateToDeviceJob = (token: string) => {
    deviceQueue.add(
        'sendNewStateToDevice',
        { token },
        {
            deduplication: { id: token },
        },
    )
}