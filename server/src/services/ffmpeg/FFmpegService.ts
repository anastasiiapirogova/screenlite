import axios, { AxiosError, AxiosInstance } from 'axios'
import { StorageService } from '../storage/StorageService.ts'

export class FFmpegService {
    private static instance: FFmpegService
    private client: AxiosInstance
    private baseURL: string

    private constructor() {
        this.baseURL = process.env.FFMPEG_SERVICE_URL || 'http://localhost:3002'
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 60000,
            maxContentLength: 50 * 1024 * 1024,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    public static getInstance(): FFmpegService {
        if (!FFmpegService.instance) {
            FFmpegService.instance = new FFmpegService()
        }
        return FFmpegService.instance
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
            const response = await this.client.post('/preview', {
                url,
                outputFormat: 'png'
            }, {
                responseType: 'arraybuffer'
            })

            return Buffer.from(response.data)
        } catch (error: unknown) {
            const axiosError = error as AxiosError

            if (axiosError.response?.data) {
                const errorData = JSON.parse(Buffer.from(axiosError.response.data as string).toString())

                throw new Error(`Preview generation failed: ${errorData.error}`)
            }
            
            throw new Error(`Preview generation failed: ${axiosError.message}`)
        }   
    }

    async getVideoMetadata(url: string): Promise<{
        width: number
        height: number
        duration: number
        codec: string
        videoBitrate: number
        videoFrameRate: number
    }> {
        try {
            const response = await this.client.post('/metadata', { url })

            return response.data
        } catch (error: unknown) {
            const axiosError = error as AxiosError

            if (axiosError.response?.data) {
                const errorData = JSON.parse(Buffer.from(axiosError.response.data as string).toString())

                throw new Error(`Metadata extraction failed: ${errorData.error}`)
            }

            throw new Error(`Metadata extraction failed: ${axiosError.message}`)
        }
    }

    async getVideoPreviewFromStorage(filePath: string): Promise<Buffer> {
        const storageService = StorageService.getInstance()
        const url = await storageService.getFileUrl(filePath)

        return this.getVideoPreview(url)
    }

    async getVideoMetadataFromStorage(filePath: string): Promise<{
        width: number
        height: number
        duration: number
        codec: string
        videoBitrate: number
        videoFrameRate: number
    }> {
        const storageService = StorageService.getInstance()
        const url = await storageService.getFileUrl(filePath)

        return this.getVideoMetadata(url)
    }
} 