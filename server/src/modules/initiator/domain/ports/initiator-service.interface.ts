import { AbstractAuthContext } from '@/core/auth/abstract-auth.context.ts'
import { Initiator } from '@/core/entities/initiator.entity.ts'

export interface IInitiatorService {
    getOrCreateInitiator(authContext: AbstractAuthContext): Promise<Initiator>
}