import { ffmpeg } from '@config/ffmpeg.js'
import { prisma } from '@config/prisma.js'
import { File } from 'generated/prisma/client.js'
import crypto from 'crypto'
import fs from 'fs'

export const generateVideoMetadata = async (file: File, localFilePath: string, previewPath: string) => {
    return new Promise<void>((resolve, reject) => {
        ffmpeg.ffprobe(localFilePath, async (err, metadata) => {
            if (err) {
                reject(err)
                return
            }

            const { width, height, duration } = metadata.streams[0]

            const md5 = crypto.createHash('md5').update(fs.readFileSync(localFilePath)).digest('hex')

            await prisma.file.update({
                where: {
                    id: file.id
                },
                data: {
                    width,
                    height,
                    duration: duration ? parseInt(duration) : 0,
                    md5,
                    previewPath,
                }
            })

            resolve()
        })
    })
}