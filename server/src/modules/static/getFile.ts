import { Request, Response } from 'express'
import { FileNotFoundError } from '../../services/storage/errors.js'
import { Storage } from '@config/storage.js'
import { normalize, extname } from 'path'
import { ResponseHandler } from '@utils/ResponseHandler.js'

interface Range {
    start: number
    end: number
}

function parseRange(rangeHeader: string, fileSize: number): Range {
    const matches = rangeHeader.match(/bytes=(\d+)-(\d+)?/)

    if (!matches) {
        throw new Error('Invalid range format')
    }

    const start = parseInt(matches[1], 10)
    const end = matches[2] ? parseInt(matches[2], 10) : fileSize - 1

    if (isNaN(start) || start < 0 || start >= fileSize) {
        throw new Error('Invalid range start')
    }

    if (isNaN(end) || end < start || end >= fileSize) {
        throw new Error('Invalid range end')
    }

    return { start, end }
}

function validateFilePath(filePath: string): string {
    const pathWithoutPrefix = filePath.startsWith('uploads/') 
        ? filePath.slice('uploads/'.length) 
        : filePath

    const normalizedPath = normalize(pathWithoutPrefix)
    
    const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath
    
    if (cleanPath.includes('..')) {
        throw new Error('Invalid file path')
    }

    return cleanPath
}

function getContentType(filePath: string): string {
    const ext = extname(filePath).toLowerCase()

    const contentTypes: Record<string, string> = {
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mkv': 'video/x-matroska',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
    }

    return contentTypes[ext] || 'application/octet-stream'
}

function setCommonHeaders(res: Response, filePath: string, fileSize: number, range?: Range) {
    const contentType = getContentType(filePath)

    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Disposition', 'inline')
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000')

    if (range) {
        const chunkSize = range.end - range.start + 1

        res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${fileSize}`)
        res.setHeader('Content-Length', chunkSize.toString())
        res.status(206)
    } else {
        res.setHeader('Content-Length', fileSize.toString())
    }
}

async function handleStream(req: Request, res: Response, stream: NodeJS.ReadableStream) {
    stream.on('error', (error) => {
        console.error('Stream error:', error)

        if (!res.headersSent) {
            ResponseHandler.serverError(req, res, 'Stream error')
        }
    })

    stream.pipe(res)
}

export const getFile = async (req: Request, res: Response) => {
    try {
        const rawFilePath = req.params[0]
        const filePath = validateFilePath(rawFilePath)
        const fileSize = await Storage.getFileSize(filePath)
        const rangeHeader = req.headers.range

        if (rangeHeader) {
            try {
                const range = parseRange(rangeHeader, fileSize)

                setCommonHeaders(res, filePath, fileSize, range)

                const stream = await Storage.createReadStream(filePath, {
                    start: range.start,
                    end: range.end
                })

                await handleStream(req, res, stream)
                return
            } catch {
                res.status(416).json({ error: 'Invalid range' })
                return
            }
        }

        setCommonHeaders(res, filePath, fileSize)
        const stream = await Storage.createReadStream(filePath)

        await handleStream(req, res, stream)
        return
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
