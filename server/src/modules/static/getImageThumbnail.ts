import { Request, Response } from 'express'
import { Readable } from 'stream'
import sharp from 'sharp'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import crypto from 'crypto'
import { StorageService } from '@services/StorageService.js'
import mime from 'mime'

interface ThumbnailOptions {
    width: number
    height: number
    quality: number
    format: 'webp'
}

const DEFAULT_THUMBNAIL_OPTIONS: ThumbnailOptions = {
    width: 250,
    height: 250,
    quality: 80,
    format: 'webp'
}

const CACHE_DURATION = 60 * 60 * 24 * 7 // 7 days

const isValidFilePath = (filePath: string): boolean => {
    const mimeType = mime.getType(filePath)

    return mimeType ? mimeType.startsWith('image/') : false
}

const generateETag = (buffer: Buffer): string => {
    return crypto.createHash('md5').update(buffer).digest('hex')
}

const generateImageThumbnail = async (imageStream: Readable): Promise<Buffer> => {
    const transformer = sharp()
        .resize(DEFAULT_THUMBNAIL_OPTIONS.width, DEFAULT_THUMBNAIL_OPTIONS.height, {
            fit: 'cover',
            position: 'centre'
        })[DEFAULT_THUMBNAIL_OPTIONS.format]({
            quality: DEFAULT_THUMBNAIL_OPTIONS.quality
        })

    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = []

        transformer.on('data', chunk => chunks.push(chunk))
        transformer.on('end', () => resolve(Buffer.concat(chunks)))
        transformer.on('error', reject)
        imageStream.pipe(transformer)
    })
}

const getS3File = async (filePath: string) => {
    const s3Stream = await StorageService.downloadFile(filePath)

    if (!s3Stream) {
        return null
    }

    const mimeType = mime.getType(filePath)

    return {
        Body: s3Stream,
        ContentType: mimeType || 'application/octet-stream'
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