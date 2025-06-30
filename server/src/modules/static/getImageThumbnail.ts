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
    
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg', '.avif']
    const fileExtension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'))
    
    return mimeType ? 
        mimeType.startsWith('image/') && allowedExtensions.includes(fileExtension) : 
        allowedExtensions.includes(fileExtension)
}

const generateImageThumbnail = async (
    imageStream: Readable,
    options: Partial<ThumbnailOptions> = {}
): Promise<Buffer> => {
    const { width, height, quality, format } = {
        ...DEFAULT_THUMBNAIL_OPTIONS,
        ...options
    }

    const imageBuffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = []

        imageStream.on('data', chunk => chunks.push(chunk))
        imageStream.on('end', () => resolve(Buffer.concat(chunks)))
        imageStream.on('error', reject)
    })

    try {
        const metadata = await sharp(imageBuffer).metadata()

        if (!metadata.format) {
            throw new Error('Unsupported image format')
        }
    } catch {
        throw new Error('Invalid or unsupported image format')
    }

    const transformer = sharp(imageBuffer)
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
    })
}


export const getImageThumbnail = async (req: Request, res: Response) => {
    try {
        const rawFilePath = req.params[0]
        const filePath = validateFilePath(rawFilePath)

        if (!isValidImageFile(filePath)) {
            return ResponseHandler.notFound(req, res)
        }

        // Check file size before processing to prevent memory issues
        const fileSize = await Storage.getFileSize(filePath)
        const MAX_IMAGE_SIZE = 50 * 1024 * 1024

        if (fileSize > MAX_IMAGE_SIZE) {
            return ResponseHandler.validationError(req, res, {
                message: 'Image file too large for thumbnail generation'
            })
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
        if (error instanceof Error && error.message === 'Invalid or unsupported image format') {
            return ResponseHandler.validationError(req, res, {
                message: 'Invalid or unsupported image format'
            })
        }
        throw error
    }
}