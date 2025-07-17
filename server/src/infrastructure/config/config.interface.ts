import {
    AppConfig,
    DatabaseConfig,
    RedisConfig,
    S3Config,
    StorageConfig
} from './types/index.ts'

export type ConfigServiceInterface = {
    app: AppConfig
    database: DatabaseConfig
    redis: RedisConfig
    s3: S3Config
    storage: StorageConfig
}