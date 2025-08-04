import { SessionDTO } from '@/shared/dto/session.dto.ts'
import { Session } from '@/core/entities/session.entity.ts'

export interface ISessionMapper {
    toDTO(entity: Session): SessionDTO
}