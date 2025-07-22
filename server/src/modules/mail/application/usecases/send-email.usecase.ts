import { SendEmailDTO } from '@/core/dto/send-email.dto.ts'
import { IMailService } from '@/core/ports/mail.interface.ts'

export class SendEmailUseCase {
    constructor(private readonly mailService: IMailService) {}

    async execute(data: SendEmailDTO): Promise<void> {
        await this.mailService.sendEmail(data)
    }
}