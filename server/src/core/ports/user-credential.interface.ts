import { UserCredentialType } from '../enums/user-credential-type.enum.ts'

export interface IUserCredential {
    readonly id: string
    readonly userId: string
    readonly type: UserCredentialType
}