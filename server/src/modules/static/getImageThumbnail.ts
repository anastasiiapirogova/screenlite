import { Request, Response } from 'express'
import { Readable } from 'stream'
import sharp from 'sharp'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import crypto from 'crypto'
import mime from 'mime'
import { Storage } from '@config/storage.js'
import { FileNotFoundError } from '../../services/storage/errors.js'
import { normalize } from 'path'

interface ThumbnailOptions {
    width: number
    height: number
    quality: number
    format: 'webp'
}

const DEFAULT_THUMBNAIL_OPTIONS: ThumbnailOptions = {
    width: 250,
    height: 250,
    quality: 95,
    format: 'webp'
}

const CACHE_DURATION = 60 * 60 * 24 * 7 // 7 days

function validateFilePath(filePath: string): string {
    const pathWithoutPrefix = filePath.startsWith('thumbnail/') 
        ? filePath.slice('thumbnail/'.length) 
        : filePath

    const normalizedPath = normalize(pathWithoutPrefix)
    
    const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath
    
    if (cleanPath.includes('..')) {
        throw new Error('Invalid file path')
    }

    return cleanPath
}

const isValidImageFile = (filePath: string): boolean => {
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

export const getImageThumbnail = async (req: Request, res: Response) => {
    try {
        const rawFilePath = req.params[0]
        const filePath = validateFilePath(rawFilePath)

        if (!isValidImageFile(filePath)) {
            return ResponseHandler.notFound(res)
        }

        const stream = await Storage.createReadStream(filePath)
        const thumbnail = await generateImageThumbnail(stream)
        const etag = generateETag(thumbnail)

        res.setHeader('ETag', etag)
        res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}`)
        res.setHeader('Expires', new Date(Date.now() + CACHE_DURATION * 1000).toUTCString())

        const ifNoneMatch = req.headers['if-none-match']

        if (ifNoneMatch === etag) {
            return ResponseHandler.notModified(res)
        }

        res.contentType(`image/${DEFAULT_THUMBNAIL_OPTIONS.format}`).send(thumbnail)
    } catch (error) {
        if (error instanceof FileNotFoundError) {
            return ResponseHandler.notFound(res)
        }
        if (error instanceof Error && error.message === 'Invalid file path') {
            return ResponseHandler.validationError(req, res, {
                message: 'Invalid file path'
            })
        }
        throw error
    }
}