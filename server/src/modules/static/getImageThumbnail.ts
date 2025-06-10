import { Request, Response } from 'express'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'
import sharp from 'sharp'
import { Buckets, s3Client } from '../../config/s3Client.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import crypto from 'crypto'

interface ThumbnailOptions {
    width: number
    height: number
    quality: number
    format: 'jpeg' | 'png' | 'webp'
}

const DEFAULT_THUMBNAIL_OPTIONS: ThumbnailOptions = {
    width: 250,
    height: 250,
    quality: 80,
    format: 'webp'
}

const CACHE_DURATION = 7 * 24 * 60 * 60

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = []

        stream.on('data', (chunk: Uint8Array) => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
}

const generateImageThumbnail = async (
    body: unknown,
    options: ThumbnailOptions = DEFAULT_THUMBNAIL_OPTIONS
): Promise<Buffer> => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stream = body instanceof Readable ? body : Readable.from(body as any)
        const buffer = await streamToBuffer(stream)

        return sharp(buffer)
            .resize(options.width, options.height, {
                fit: 'inside',
                withoutEnlargement: true
            })[options.format]({
                quality: options.quality,
                force: true
            })
            .toBuffer()
    } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error during thumbnail generation')

        throw error
    }
}

const generateETag = (buffer: Buffer): string => {
    return crypto.createHash('sha256').update(buffer).digest('hex')
}

const isValidFilePath = (filePath: string): boolean => {
    if (!filePath || filePath.includes('..')) return false
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

    return allowedExtensions.some(ext => filePath.toLowerCase().endsWith(ext))
}

const getS3File = async (filePath: string) => {
    const command = new GetObjectCommand({
        Bucket: Buckets.uploads,
        Key: filePath,
    })

    try {
        return await s3Client.send(command)
    } catch (error) {
        if (error instanceof Error && error.name === 'NoSuchKey') {
            return null
        }
        throw error
    }
}

export const getImageThumbnail = async (req: Request, res: Response) => {
    const filePath = req.params[0]

    if (!isValidFilePath(filePath)) {
        return ResponseHandler.notFound(res)
    }

    const s3File = await getS3File(filePath)

    if (!s3File?.Body || !s3File.ContentType) {
        return ResponseHandler.notFound(res)
    }

    if (!s3File.ContentType.startsWith('image/')) {
        return ResponseHandler.empty(res)
    }

    const thumbnail = await generateImageThumbnail(s3File.Body)
    const etag = generateETag(thumbnail)

    res.setHeader('ETag', etag)
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}`)
    res.setHeader('Expires', new Date(Date.now() + CACHE_DURATION * 1000).toUTCString())

    const ifNoneMatch = req.headers['if-none-match']

    if (ifNoneMatch === etag) {
        return ResponseHandler.notModified(res)
    }

    res.contentType(`image/${DEFAULT_THUMBNAIL_OPTIONS.format}`).send(thumbnail)
}