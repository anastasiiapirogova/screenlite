import { Buckets, s3Client } from '@config/s3Client.js'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

export const uploadProfilePhotoToS3 = async (userId: string, picture: Express.Multer.File) => {
    const path = `users/${userId}/photo.jpg`

    try {
        const resizedImageBuffer = await sharp(picture.buffer)
            .resize(514, 514, { fit: 'cover' })
            .jpeg()
            .toBuffer()

        await s3Client.send(new PutObjectCommand({
            Bucket: Buckets.uploads,
            Key: path,
            Body: resizedImageBuffer,
            ContentType: picture.mimetype,
        }))
    } catch {
        return false
    }

    return path
}