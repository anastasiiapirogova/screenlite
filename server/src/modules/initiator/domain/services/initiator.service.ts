import { Initiator } from '@/core/entities/initiator.entity.ts'
import { AbstractAuthContext } from '@/core/auth/abstract-auth.context.ts'
import { IInitiatorRepository } from '../ports/initiator-repository.interface.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { IInitiatorService } from '../ports/initiator-service.interface.ts'

export class InitiatorService implements IInitiatorService {
    private readonly systemInitiatorId = '00000000-0000-0000-0000-000000000001'
    private readonly guestInitiatorId = '00000000-0000-0000-0000-000000000002'

    constructor(private readonly initiatorRepository: IInitiatorRepository) {}

    async getOrCreateInitiator(authContext: AbstractAuthContext): Promise<Initiator> {
        switch (authContext.type) {
            case AuthContextType.UserSession:
                if(!authContext.isUserContext()) {
                    throw new Error('Unsupported authentication context type')
                }
                return this.getOrCreateUserInitiator(authContext.user.id)
            case AuthContextType.System:
                return this.getSystemInitiator()
            case AuthContextType.Guest:
                return this.getGuestInitiator()
        }

        throw new Error('Unsupported authentication context type')
    }

    private async getOrCreateUserInitiator(userId: string): Promise<Initiator> {
        let initiator = await this.initiatorRepository.findByUserId(userId)

        if (!initiator) {
            initiator = Initiator.createUserInitiator(userId)
            await this.initiatorRepository.save(initiator)
        }

        return initiator
    }

    private async getSystemInitiator(): Promise<Initiator> {
        let initiator = await this.initiatorRepository.findSystemInitiator()

        if (!initiator) {
            initiator = Initiator.createSystemInitiator(this.systemInitiatorId)
            await this.initiatorRepository.save(initiator)
        }

        return initiator
    }

    private async getGuestInitiator(): Promise<Initiator> {
        let initiator = await this.initiatorRepository.findGuestInitiator()

        if (!initiator) {
            initiator = Initiator.createGuestInitiator(this.guestInitiatorId)
            await this.initiatorRepository.save(initiator)
        }

        return initiator
    }
}