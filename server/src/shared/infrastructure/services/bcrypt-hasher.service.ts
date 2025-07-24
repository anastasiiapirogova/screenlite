import { IHasher } from '@/core/ports/hasher.interface.ts'
import bcrypt from 'bcrypt'

export class BcryptHasher implements IHasher {
    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, 12)
    }

    async compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash)
    }
}