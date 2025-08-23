import { UserCredentialType } from '../enums/user-credential-type.enum.ts'
import { IHasher } from '../ports/hasher.interface.ts'
import { IUserCredential } from '../ports/user-credential.interface.ts'

export class UserPassword implements IUserCredential {  
    readonly type = UserCredentialType.PASSWORD
  
    constructor(
        public readonly id: string,
        public readonly userId: string,
        private hash: string,
        private updatedAt: Date
    ) {}
  
    async validate(plain: string, hasher: IHasher): Promise<boolean> {
        return hasher.compare(plain, this.hash)
    }
  
    async update(plain: string, hasher: IHasher): Promise<void> {
        this.hash = await hasher.hash(plain)
        this.updatedAt = new Date()
    }
  
    get passwordHash(): string {
        return this.hash
    }
  
    get passwordUpdatedAt(): Date {
        return this.updatedAt
    }
}
  