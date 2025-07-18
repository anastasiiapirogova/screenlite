import {
    AppConfig,
    DatabaseConfig,
    RedisConfig,
    S3Config,
    S3BucketsConfig,
    StorageConfig,
    SecretsConfig,
    FFmpegConfig
} from './types/index.ts'

export type ConfigServiceInterface = {
    app: AppConfig
    database: DatabaseConfig
    redis: RedisConfig
    storage: StorageConfig
    secrets: SecretsConfig
    ffmpeg: FFmpegConfig
    s3Buckets: S3BucketsConfig
    s3?: S3Config
}