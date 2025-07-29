import { IObjectHasher } from '@/core/ports/object-hasher.interface.ts'
import { stableStringify } from '@/shared/utils/stable-stringify.util.ts'
import crypto from 'crypto'

export class StableObjectHasher implements IObjectHasher {
    async hash(value: unknown): Promise<string> {
        const str = typeof value === 'string' ? value : stableStringify(value)

        return crypto.createHash('sha256').update(str).digest('hex')
    }

    async compare(value: unknown, hash: string): Promise<boolean> {
        const hashedValue = await this.hash(value)

        try {
            return crypto.timingSafeEqual(
                Buffer.from(hashedValue),
                Buffer.from(hash)
            )
        } catch {
            return false
        }
    }
}