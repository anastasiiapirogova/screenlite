import fs from 'fs'
import path from 'path'
import { ffmpeg } from '@config/ffmpeg.js'

export const generateVideoPreview = async (localFilePath: string, tempPreviewPath: string) => {
    fs.mkdirSync(path.dirname(tempPreviewPath), { recursive: true })

    return new Promise<void>((resolve, reject) => {
        ffmpeg(localFilePath)
            .on('end', () => resolve())
            .on('error', reject)
            .thumbnail({
                timestamps: ['50%'],
                filename: tempPreviewPath,
            })
    })
}