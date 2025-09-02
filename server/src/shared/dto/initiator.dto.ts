import { InitiatorType } from '@/core/enums/initiator-type.enum.ts'

export interface InitiatorDTO {
    id: string
    type: InitiatorType
    userId: string | null
}