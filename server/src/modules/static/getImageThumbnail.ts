import { Request, Response } from 'express'
import { Readable } from 'stream'
import sharp from 'sharp'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import mime from 'mime'
import { Storage } from '@/config/storage.ts'
import { FileNotFoundError } from '../../services/storage/errors.ts'
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

const generateImageThumbnail = async (
    imageStream: Readable,
    options: Partial<ThumbnailOptions> = {}
): Promise<Buffer> => {
    const { width, height, quality, format } = {
        ...DEFAULT_THUMBNAIL_OPTIONS,
        ...options
    }

    const transformer = sharp()
        .resize({
            width,
            height,
            fit: 'inside',
            withoutEnlargement: true,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })[format]({
            quality
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
            return ResponseHandler.notFound(req, res)
        }

        const stream = await Storage.createReadStream(filePath)
        const thumbnail = await generateImageThumbnail(stream)

        res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}`)
        res.setHeader('Expires', new Date(Date.now() + CACHE_DURATION * 1000).toUTCString())

        res.contentType(`image/${DEFAULT_THUMBNAIL_OPTIONS.format}`).send(thumbnail)
    } catch (error) {
        if (error instanceof FileNotFoundError) {
            return ResponseHandler.notFound(req, res)
        }
        if (error instanceof Error && error.message === 'Invalid file path') {
            return ResponseHandler.validationError(req, res, {
                message: 'Invalid file path'
            })
        }
        throw error
    }
}