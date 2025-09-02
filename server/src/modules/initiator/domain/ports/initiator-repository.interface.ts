import { Initiator } from '@/core/entities/initiator.entity.ts'

export interface IInitiatorRepository {
    findByUserId(userId: string): Promise<Initiator | null>
    findSystemInitiator(): Promise<Initiator | null>
    findGuestInitiator(): Promise<Initiator | null>
    save(initiator: Initiator): Promise<void>
    findById(id: string): Promise<Initiator | null>
}