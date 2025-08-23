import { IUserCredential } from './user-credential.interface.ts'

export interface IUserCredentialRepository {
    findByUserId(userId: string): Promise<IUserCredential[]>
    save(credential: IUserCredential): Promise<void>
    delete(id: string): Promise<void>
}