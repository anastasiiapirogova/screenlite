import fs from 'fs'
import { spawn } from 'child_process'
import crypto from 'crypto'
import { prisma } from '@config/prisma.js'
import { File } from '@generated/prisma/client.js'

export const generateVideoMetadata = async (file: File, localFilePath: string, previewPath: string) => {
    return new Promise<void>((resolve, reject) => {
        const ffprobeArgs = [
            '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height,duration',
            '-of', 'json',
            localFilePath
        ]

        const ffprobe = spawn('ffprobe', ffprobeArgs)
        let output = ''
        let error = ''

        ffprobe.stdout.on('data', (data) => {
            output += data.toString()
        })

        ffprobe.stderr.on('data', (data) => {
            error += data.toString()
        })

        ffprobe.on('close', async (code) => {
            if (code !== 0) {
                reject(new Error(`ffprobe exited with code ${code}: ${error}`))
                return
            }

            try {
                const json = JSON.parse(output)
                const stream = json.streams && json.streams[0]

                if (!stream) {
                    reject(new Error('No video stream found'))
                    return
                }
                const width = stream.width || 0
                const height = stream.height || 0
                const duration = stream.duration ? parseInt(stream.duration) : 0

                const md5 = crypto.createHash('md5').update(fs.readFileSync(localFilePath)).digest('hex')

                await prisma.file.update({
                    where: { id: file.id },
                    data: { width, height, duration, md5, previewPath }
                })

                resolve()
            } catch (err) {
                reject(err)
            }
        })

        ffprobe.on('error', reject)
    })
}