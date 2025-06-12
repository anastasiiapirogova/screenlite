import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

export const generateVideoPreview = async (localFilePath: string, tempPreviewPath: string) => {
    fs.mkdirSync(path.dirname(tempPreviewPath), { recursive: true })

    if (!fs.existsSync(localFilePath)) {
        throw new Error(`Input file does not exist: ${localFilePath}`)
    }

    return new Promise<void>((resolve, reject) => {
        const args = [
            '-y',
            '-i', localFilePath,
            '-frames:v', '1',
            '-update', '1',
            tempPreviewPath
        ]

        const ffmpeg = spawn('ffmpeg', args)

        ffmpeg.on('error', reject)

        ffmpeg.stderr.on('data', (data) => {
            console.error(`ffmpeg stderr: ${data}`)
        })

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(`ffmpeg exited with code ${code}`))
            }
        })
    })
}