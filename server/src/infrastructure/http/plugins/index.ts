
import configPlugin from './config.plugin.ts'
import prismaPlugin from './prisma.plugin.ts'
import s3ClientPlugin from './s3-client.plugin.ts'
import mailPlugin from './mail.plugin.ts'
import storagePlugin from './storage.plugin.ts'
import cryptoPlugin from './crypto.plugin.ts'
import settingsPlugin from './settings.plugin.ts'
import customValidationErrorHandler from './custom-validation-error-handler.plugin.ts'
import redisPlugin from './redis.plugin.ts'
import multipartUploadPlugin from './multipart-upload.plugin.ts'

export default {
    configPlugin,
    prismaPlugin,
    s3ClientPlugin,
    mailPlugin,
    storagePlugin,
    cryptoPlugin,
    settingsPlugin,
    customValidationErrorHandler,
    redisPlugin,
    multipartUploadPlugin
}