import axios, { AxiosInstance, AxiosError } from 'axios'
import { IFFmpegService, VideoMetadata } from '@/core/ports/ffmpeg.interface.ts'
import { ConfigService } from '@/infrastructure/config/config.service.ts'
import { IStorage } from '@/core/ports/storage.interface.ts'

export class FFmpegService implements IFFmpegService {
    private client: AxiosInstance
    private storage: IStorage

    constructor(
        storage: IStorage,
        configService: ConfigService
    ) {
        this.storage = storage
        const config = configService.ffmpeg
        
        this.client = axios.create({
            baseURL: config.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
    }

    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.client.get('/health')

            return response.data.status === 'healthy'
        } catch (error) {
            console.error('FFmpeg service health check failed:', error)
            return false
        }
    }

    async getVideoPreview(url: string): Promise<Buffer> {
        try {
            const response = await this.client.post(
                '/preview', 
                { url }, 
                { responseType: 'arraybuffer' }
            )

            return Buffer.from(response.data)
        } catch (error: unknown) {
            this.handleError(error, 'Preview generation failed')
        }
    }

    async getVideoMetadata(url: string): Promise<VideoMetadata> {
        try {
            const response = await this.client.post('/metadata', { url })

            return response.data as VideoMetadata
        } catch (error: unknown) {
            this.handleError(error, 'Metadata extraction failed')
        }
    }

    async getVideoPreviewFromStorage(filePath: string): Promise<Buffer> {
        const url = await this.storage.getFileUrl(filePath)

        return this.getVideoPreview(url)
    }

    async getVideoMetadataFromStorage(filePath: string): Promise<VideoMetadata> {
        const url = await this.storage.getFileUrl(filePath)

        return this.getVideoMetadata(url)
    }

    private handleError(error: unknown, context: string): never {
        const axiosError = error as AxiosError

        if (axiosError.response?.data) {
            let errorMessage: string
            const responseData = axiosError.response.data

            if (typeof responseData === 'string') {
                errorMessage = responseData
            } else if (Buffer.isBuffer(responseData)) {
                errorMessage = responseData.toString()
            } else {
                try {
                    errorMessage = JSON.stringify(responseData)
                } catch {
                    errorMessage = 'Unknown error format'
                }
            }

            throw new Error(`${context}: ${errorMessage}`)
        }

        throw new Error(`${context}: ${axiosError.message}`)
    }
}