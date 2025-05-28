import { Buckets, s3Client } from '@config/s3Client.js'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { File } from 'generated/prisma/client.js'
import { storeFileLocallyFromS3 } from '../storeFileLocallyFromS3.js'
import { generateVideoMetadata } from './generateVideoMetadata.js'
import { generateVideoPreview } from './generateVideoPreview.js'
import { v4 as uuid } from 'uuid'

export const generateVideoPreviewAndMetadata = async (file: File) => {
    const previewPath = `previews/${uuid()}.jpg`
    const tempPreviewPath = path.join(process.cwd(), 'tmp', previewPath)
    const localFilePath = path.join(process.cwd(), 'tmp', file.path)

	try {
        await storeFileLocallyFromS3(file, localFilePath)
        await generateVideoPreview(localFilePath, tempPreviewPath)

        const previewFile = fs.readFileSync(tempPreviewPath)

        await s3Client.send(new PutObjectCommand({
            Bucket: Buckets.uploads,
            Key: previewPath,
            Body: previewFile,
            ContentType: 'image/jpeg'
        }))

        await generateVideoMetadata(file, localFilePath, previewPath)
    } catch (error) {
        console.error(error)
    } finally {
        fs.unlinkSync(localFilePath)
        fs.unlinkSync(tempPreviewPath)
    }
}