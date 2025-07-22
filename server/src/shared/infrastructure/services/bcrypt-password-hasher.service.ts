import { IPasswordHasher } from '@/core/ports/password-hasher.interface.ts'
import bcrypt from 'bcrypt'

export class BcryptPasswordHasher implements IPasswordHasher {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 12)
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }
}