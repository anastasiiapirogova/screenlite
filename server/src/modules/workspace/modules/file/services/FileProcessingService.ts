import { spawn } from 'child_process'
import sharp from 'sharp'
import { Readable } from 'stream'

export class FileProcessingService {
    public static async getVideoPreview(url: string): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const args = [
                '-i', url,
                '-frames:v', '1',
                '-f', 'image2pipe',
                '-vcodec', 'png',
                'pipe:1'
            ]

            const ffmpeg = spawn('ffmpeg', args)

            const chunks: Buffer[] = []

            ffmpeg.stdout.on('data', (chunk) => chunks.push(chunk))

            ffmpeg.on('error', (err: Error) => reject(err))

            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    resolve(Buffer.concat(chunks))
                } else {
                    reject(new Error(`ffmpeg exited with code ${code}`))
                }
            })
        })
    }

    public static async tryGetMetadata(args: string[]): Promise<{
        width: number
        height: number
        duration: number
        codec: string
        videoBitrate: number
        videoFrameRate: number
    }> {
        return new Promise((resolve, reject) => {
            const ffprobe = spawn('ffprobe', args)
            let output = ''
            let error = ''

            ffprobe.stdout.on('data', (data) => (output += data.toString()))
            ffprobe.stderr.on('data', (data) => (error += data.toString()))
            ffprobe.on('error', reject)

            ffprobe.on('close', async (code) => {
                if (code !== 0) {
                    return reject(new Error(`ffprobe exited with code ${code}: ${error}`))
                }

                try {
                    const json = JSON.parse(output)
                    const stream = json.streams?.[0]
                    const format = json.format

                    if (!stream || !format) {
                        return reject(new Error('Missing stream or format data'))
                    }

                    const width = stream.width ?? 0
                    const height = stream.height ?? 0
                    const duration = format.duration ? Math.round(parseFloat(format.duration) * 1000) : 0
                    const codec = stream.codec_name
                    const videoBitrate = stream.bit_rate ? parseInt(stream.bit_rate) : 0
                    const videoFrameRate = stream.r_frame_rate ? parseFloat(stream.r_frame_rate) : 0

                    resolve({ width, height, duration, codec, videoBitrate, videoFrameRate })
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    public static async getVideoMetadata(url: string): Promise<{
        width: number
        height: number
        duration: number
        codec: string
        videoBitrate: number
        videoFrameRate: number
    }> {
        const args = [
            '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height,codec_name,codec_type,bit_rate,r_frame_rate',
            '-show_entries', 'format=duration,format_name',
            '-of', 'json',
            url
        ]

        try {
            return await FileProcessingService.tryGetMetadata(args)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)

            throw new Error(`Failed to get video metadata: ${errorMessage}.`)
        }
    }

    public static async getImageMetadata(readStream: Readable): Promise<{
        width: number
        height: number
    }> {
        return new Promise((resolve, reject) => {
            const transformer = sharp()

            transformer.on('error', reject)
            readStream.on('error', reject)

            transformer.metadata()
                .then(({ width = 0, height = 0 }) => {
                    resolve({ width, height })
                })
                .catch(reject)

            readStream.pipe(transformer)
        })
    }
}
