
import configPlugin from './config.plugin.ts'
import prismaPlugin from './prisma.plugin.ts'
import s3clientPlugin from './s3client.plugin.ts'
import mailPlugin from './mail.plugin.ts'
import storagePlugin from './storage.plugin.ts'
import cryptoPlugin from './crypto.plugin.ts'
import settingsPlugin from './settings.plugin.ts'
import customValidationErrorHandler from './custom-validation-error-handler.plugin.ts'
    
export default { configPlugin, prismaPlugin, s3clientPlugin, mailPlugin, storagePlugin, cryptoPlugin, settingsPlugin, customValidationErrorHandler }