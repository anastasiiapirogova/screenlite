import { Buckets, s3Client } from '@config/s3Client.js'
import fs from 'fs'
import path from 'path'
import { File } from 'generated/prisma/client.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

export const storeFileLocallyFromS3 = async (file: File, localFilePath: string) => {
    const s3 = s3Client

    const params = {
        Bucket: Buckets.uploads,
        Key: file.path
    }

    fs.mkdirSync(path.dirname(localFilePath), { recursive: true })

    const fileStream = fs.createWriteStream(localFilePath)
    const files = await s3.send(new GetObjectCommand(params))

    if (files.Body instanceof Readable) {
        files.Body.pipe(fileStream)
    } else {
        throw new Error('File not found in S3')
    }

    return new Promise<void>((resolve, reject) => {
        fileStream.on('finish', resolve)
        fileStream.on('error', reject)
    })
}