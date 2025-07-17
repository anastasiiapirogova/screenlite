import { z } from 'zod'
import { appSchema } from '../schemas/app.schema.ts'
import { databaseSchema } from '../schemas/database.schema.ts'
import { redisSchema } from '../schemas/redis.schema.ts'
import { storageSchema } from '../schemas/storage.schema.ts'
import { s3Schema } from '../schemas/s3.schema.ts'
import { secretsSchema } from '../schemas/secret.schema.ts'

export type DatabaseConfig = z.infer<typeof databaseSchema>
export type RedisConfig = z.infer<typeof redisSchema>
export type AppConfig = z.infer<typeof appSchema>
export type StorageConfig = z.infer<typeof storageSchema>
export type S3Config = z.infer<typeof s3Schema> | undefined
export type SecretsConfig = z.infer<typeof secretsSchema>