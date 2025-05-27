import { prisma } from '@config/prisma.js'
import { File } from 'generated/prisma/client.js'
import crypto from 'crypto'
import fs from 'fs'
import sharp from 'sharp'

export const generateImageMetadata = async (file: File, localFilePath: string, previewPath: string) => {
    try {
        const image = sharp(localFilePath)
        const metadata = await image.metadata()

        const { width, height } = metadata

        const md5 = crypto.createHash('md5').update(fs.readFileSync(localFilePath)).digest('hex')

        await prisma.file.update({
            where: {
                id: file.id
            },
            data: {
                width,
                height,
                md5,
                previewPath,
            }
        })
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Failed to generate image metadata: ${err.message}`)
        } else {
            throw new Error('Failed to generate image metadata: Unknown error')
        }
    }
}
