import { IMailService } from '@/core/ports/mail.interface.ts'
import { MailConfig } from '@/infrastructure/mail/dto/mail-config.dto.ts'

export class TestMailConfigUsecase {
    constructor(private readonly mailService: IMailService) {}

    async execute(config: MailConfig): Promise<boolean> {
        return this.mailService.testMailConfig(config)
    }
}