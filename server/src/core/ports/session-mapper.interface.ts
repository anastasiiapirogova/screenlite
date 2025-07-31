import { SessionDTO } from '../dto/session.dto.ts'
import { Session } from '../entities/session.entity.ts'

export interface ISessionMapper {
    toDTO(entity: Session): SessionDTO
}