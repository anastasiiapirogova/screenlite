import { appSchema } from './schemas/app.schema.ts'
import { databaseSchema } from './schemas/database.schema.ts'
import { redisSchema } from './schemas/redis.schema.ts'
import { s3Schema } from './schemas/s3.schema.ts'
import { secretsSchema } from './schemas/secret.schema.ts'
import { storageSchema } from './schemas/storage.schema.ts'
import { AppConfig, DatabaseConfig, RedisConfig, S3Config, SecretsConfig, StorageConfig } from './types/index.ts'

export class ConfigService {
    private readonly _database: DatabaseConfig
    private readonly _redis: RedisConfig
    private readonly _app: AppConfig
    private readonly _storage: StorageConfig
    private readonly _s3: S3Config
    private readonly _secrets: SecretsConfig

    constructor(env: NodeJS.ProcessEnv = process.env) {
        const databaseConfig = {
            url: env.DATABASE_URL,
        }
        
        const appConfig = {
            frontendUrl: env.FRONTEND_URL,
            backendUrl: env.BACKEND_URL,
        }

        const redisConfig = {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            password: env.REDIS_PASSWORD,
            db: env.REDIS_DB,
        }

        const storageConfig = {
            type: env.STORAGE_TYPE,
        }

        const secretsConfig = {
            cryptoSecret: env.CRYPTO_SECRET,
        }

        let s3Config: S3Config = undefined

        if (storageConfig.type === 's3') {
            s3Config = s3Schema.parse({
                region: env.S3_REGION,
                endpoint: env.S3_ENDPOINT,
                port: env.S3_PORT,
                accessKey: env.S3_ACCESS_KEY,
                secretAccessKey: env.S3_SECRET_KEY,
            })
        }

        this._database = databaseSchema.parse(databaseConfig)
        this._redis = redisSchema.parse(redisConfig)
        this._app = appSchema.parse(appConfig)
        this._storage = storageSchema.parse(storageConfig)
        this._s3 = s3Config
        this._secrets = secretsSchema.parse(secretsConfig)
    }

    get database(): DatabaseConfig {
        return this._database
    }

    get redis(): RedisConfig {
        return this._redis
    }

    get app(): AppConfig {
        return this._app
    }

    get storage(): StorageConfig {
        return this._storage
    }

    get s3(): S3Config {
        return this._s3
    }

    get secrets(): SecretsConfig {
        return this._secrets
    }
}