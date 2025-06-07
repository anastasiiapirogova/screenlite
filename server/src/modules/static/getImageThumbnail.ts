import { Request, Response } from 'express'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'
import sharp from 'sharp'
import { Buckets, s3Client } from '../../config/s3Client.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import crypto from 'crypto'

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = []

        stream.on('data', (chunk: Uint8Array) => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
}

const generateImageThumbnail = async (readableStream: Readable): Promise<Buffer> => {
    const buffer = await streamToBuffer(readableStream)

    return sharp(buffer)
        .resize(250, 250, { fit: 'inside' })
        .png({ quality: 100, force: true })
        .toBuffer()
}

const generateETag = (buffer: Buffer): string => {
    return crypto.createHash('sha256').update(buffer).digest('hex')
}

const isValidFilePath = (filePath: string): boolean => {
    return !!filePath && !filePath.includes('..')
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
        ResponseHandler.notFound(res)
        return
    }

    const s3File = await getS3File(filePath)

    if (!s3File || !s3File.Body) {
        ResponseHandler.notFound(res)
        return
    }

    const contentType = s3File.ContentType

    if (!contentType || !contentType.startsWith('image/')) {
        res.status(204).send()
        return
    }

    const thumbnail = await generateImageThumbnail(s3File.Body)
    const etag = generateETag(thumbnail)

    res.setHeader('ETag', etag)

    const ifNoneMatch = req.headers['if-none-match']

    if (ifNoneMatch === etag) {
        res.status(304).send()
        return
    }

    res.contentType('image/jpeg').send(thumbnail)
}