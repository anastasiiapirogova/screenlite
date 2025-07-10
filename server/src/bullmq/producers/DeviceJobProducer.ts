import { deviceQueue } from '@/bullmq/queues/deviceQueue.ts'

export class DeviceJobProducer {
    static async queueSendNewStateToDeviceJob(token: string): Promise<void> {
        await deviceQueue.add(
            'sendNewStateToDevice',
            { token },
            {
                deduplication: { id: token },
            }
        )
    }
} 