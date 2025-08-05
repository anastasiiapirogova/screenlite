import { IConfig } from '@/infrastructure/config/config.interface.ts'

export class GetPublicConfigUsecase {
    constructor(private readonly configService: IConfig) {}

    async execute() {
        const config = this.configService

        return {
            app: {
                frontendVersion: config.app.frontendVersion,
                backendVersion: config.app.backendVersion,
            },
            limits: {
                allowedFileTypes: 0,
                maxFolderDepth: 0,
                maxUploadFileSize: 0,
                maxUploadFilePartSize: 0
            },
        }
    }
}