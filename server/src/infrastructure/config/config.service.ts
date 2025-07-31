import { ZodError, z } from 'zod'
import { appSchema } from './schemas/app.schema.ts'
import { databaseSchema } from './schemas/database.schema.ts'
import { ffmpegSchema } from './schemas/ffmpeg.schema.ts'
import { redisSchema } from './schemas/redis.schema.ts'
import { s3BucketsSchema } from './schemas/s3-buckets.schema.ts'
import { s3Schema } from './schemas/s3.schema.ts'
import { secretsSchema } from './schemas/secret.schema.ts'
import { storageSchema } from './schemas/storage.schema.ts'
import {
    AppConfig,
    DatabaseConfig,
    FFmpegConfig,
    RedisConfig,
    S3BucketsConfig,
    S3Config,
    SecretsConfig,
    StorageConfig,
    TTLsConfig
} from './types/index.ts'
import { IConfig } from './config.interface.ts'
import { TTLsSchema } from './schemas/ttls.schema.ts'

type ConfigDefinition<T> = {
    data: Record<string, unknown>
    schema: z.ZodType<T>
    envMap?: Record<string, string>
}

export class ConfigService implements IConfig {
    private readonly _database: DatabaseConfig
    private readonly _redis: RedisConfig
    private readonly _app: AppConfig
    private readonly _storage: StorageConfig
    private readonly _secrets: SecretsConfig
    private readonly _ffmpeg: FFmpegConfig
    private readonly _s3Buckets: S3BucketsConfig
    private readonly _s3: S3Config | undefined
    private readonly _ttls: TTLsConfig

    constructor(env: NodeJS.ProcessEnv = process.env) {
        const errors: string[] = []
    
        const parseConfig = <T>(
            schema: z.ZodType<T>,
            config: unknown,
            name: string,
            envMap?: Record<string, string>
        ): T | undefined => {
            try {
                return schema.parse(config)
            } catch (error) {
                if (error instanceof ZodError) {
                    for (const e of error.issues) {
                        const path = e.path.join('.')
                        const envVar = envMap?.[path] || path

                        errors.push(`${name}.${path} (env: ${envVar}): ${e.message}`)
                    }
                } else {
                    errors.push(`${name}: ${(error as Error).message}`)
                }
                return undefined
            }
        }

        const configDefinitions: Record<string, ConfigDefinition<unknown>> = {
            database: {
                data: {
                    url: env.DATABASE_URL
                },
                envMap: {
                    url: 'DATABASE_URL'
                },
                schema: databaseSchema
            },
            redis: {
                data: {
                    host: env.REDIS_HOST,
                    port: env.REDIS_PORT,
                    password: env.REDIS_PASSWORD,
                    db: env.REDIS_DB,
                    username: env.REDIS_USERNAME
                },
                envMap: {
                    host: 'REDIS_HOST',
                    port: 'REDIS_PORT',
                    password: 'REDIS_PASSWORD',
                    db: 'REDIS_DB',
                    username: 'REDIS_USERNAME'
                },
                schema: redisSchema
            },
            app: {
                data: {
                    frontendUrl: env.FRONTEND_URL,
                    backendUrl: env.BACKEND_URL,
                    allowedCorsOrigins: env.ALLOWED_CORS_ORIGINS?.split(',') || []
                },
                envMap: {
                    frontendUrl: 'FRONTEND_URL',
                    backendUrl: 'BACKEND_URL',
                    allowedCorsOrigins: 'ALLOWED_CORS_ORIGINS'
                },
                schema: appSchema
            },
            storage: {
                data: {
                    type: env.STORAGE_TYPE
                },
                envMap: {
                    type: 'STORAGE_TYPE'
                },
                schema: storageSchema
            },
            secrets: {
                data: {
                    encryptionSecret: env.ENCRYPTION_SECRET
                },
                envMap: {
                    encryptionSecret: 'ENCRYPTION_SECRET'
                },
                schema: secretsSchema
            },
            ffmpeg: {
                data: {
                    apiUrl: env.FFMPEG_SERVICE_API_URL
                },
                envMap: {
                    apiUrl: 'FFMPEG_SERVICE_API_URL'
                },
                schema: ffmpegSchema
            },
            s3Buckets: {
                data: {
                    userUploads: 'screenlite-uploads'
                },
                envMap: {
                    userUploads: 'S3_USER_UPLOADS'
                },
                schema: s3BucketsSchema
            },
            ttls: {
                data: {
                    emailVerification: 1000 * 60 * 60 * 24, // 24 hours
                    emailChange: 1000 * 60 * 60 * 24, // 24 hours
                    passwordReset: 1000 * 60 * 60 * 24, // 24 hours
                },
                schema: TTLsSchema
            }
        }

        const parsedConfigs = {
            database: parseConfig(
                configDefinitions.database.schema,
                configDefinitions.database.data,
                'database',
                configDefinitions.database.envMap
            ) as DatabaseConfig,
            redis: parseConfig(
                configDefinitions.redis.schema,
                configDefinitions.redis.data,
                'redis',
                configDefinitions.redis.envMap
            ) as RedisConfig,
            app: parseConfig(
                configDefinitions.app.schema,
                configDefinitions.app.data,
                'app',
                configDefinitions.app.envMap
            ) as AppConfig,
            storage: parseConfig(
                configDefinitions.storage.schema,
                configDefinitions.storage.data,
                'storage',
                configDefinitions.storage.envMap
            ) as StorageConfig,
            secrets: parseConfig(
                configDefinitions.secrets.schema,
                configDefinitions.secrets.data,
                'secrets',
                configDefinitions.secrets.envMap
            ) as SecretsConfig,
            ffmpeg: parseConfig(
                configDefinitions.ffmpeg.schema,
                configDefinitions.ffmpeg.data,
                'ffmpeg',
                configDefinitions.ffmpeg.envMap
            ) as FFmpegConfig,
            s3Buckets: parseConfig(
                configDefinitions.s3Buckets.schema,
                configDefinitions.s3Buckets.data,
                's3Buckets'
            ) as S3BucketsConfig,
            ttls: parseConfig(
                configDefinitions.ttls.schema,
                configDefinitions.ttls.data,
                'ttls'
            ) as TTLsConfig
        }

        let s3: S3Config | undefined

        if (parsedConfigs.storage?.type === 's3') {
            const s3Config = {
                region: env.S3_REGION,
                endpoint: env.S3_ENDPOINT,
                port: env.S3_PORT,
                accessKey: env.S3_ACCESS_KEY,
                secretAccessKey: env.S3_SECRET_KEY
            }
            const s3EnvMap = {
                region: 'S3_REGION',
                endpoint: 'S3_ENDPOINT',
                port: 'S3_PORT',
                accessKey: 'S3_ACCESS_KEY',
                secretAccessKey: 'S3_SECRET_KEY'
            }

            s3 = parseConfig(s3Schema, s3Config, 's3', s3EnvMap) as S3Config | undefined
        }

        if (errors.length > 0) {
            console.error('Configuration validation failed:\n')
            console.error(errors.map(e => `  • ${e}`).join('\n'))
            console.error('\nPlease check your environment variables')
            process.exit(1)
        }

        this._database = parsedConfigs.database!
        this._redis = parsedConfigs.redis!
        this._app = parsedConfigs.app!
        this._storage = parsedConfigs.storage!
        this._secrets = parsedConfigs.secrets!
        this._ffmpeg = parsedConfigs.ffmpeg!
        this._s3Buckets = parsedConfigs.s3Buckets!
        this._s3 = s3
        this._ttls = parsedConfigs.ttls!
    }

    get database(): DatabaseConfig { return this._database }
    get redis(): RedisConfig { return this._redis }
    get app(): AppConfig { return this._app }
    get storage(): StorageConfig { return this._storage }
    get secrets(): SecretsConfig { return this._secrets }
    get ffmpeg(): FFmpegConfig { return this._ffmpeg }
    get s3Buckets(): S3BucketsConfig { return this._s3Buckets }
    get s3(): S3Config | undefined { return this._s3 }
    get ttls(): TTLsConfig { return this._ttls }
}