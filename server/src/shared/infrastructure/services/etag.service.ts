import { IEtagService } from '@/core/ports/etag-service.interface.ts'
import { createHash } from 'crypto'

export class EtagService implements IEtagService {
    public generate(buffer: Buffer): string {
        return createHash('sha256').update(buffer).digest('hex')
    }
}