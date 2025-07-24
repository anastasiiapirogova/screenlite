import { IHasher } from '@/core/ports/hasher.interface.ts'
import crypto from 'crypto'

export class FastHasher implements IHasher {
    async hash(value: string): Promise<string> {
        return crypto.createHash('sha256').update(value).digest('hex')
    }

    async compare(value: string, hash: string): Promise<boolean> {
        const hashedValue = await this.hash(value)

        return crypto.timingSafeEqual(Buffer.from(hashedValue), Buffer.from(hash))
    }
}