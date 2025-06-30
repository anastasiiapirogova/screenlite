import sharp from 'sharp'
import { Readable } from 'stream'

export class FileProcessingService {
    public static async getImageMetadata(readStream: Readable): Promise<{
        width: number
        height: number
    }> {
        return new Promise((resolve, reject) => {
            const transformer = sharp()

            transformer.on('error', reject)
            readStream.on('error', reject)

            transformer.metadata()
                .then(({ width = 0, height = 0 }) => {
                    resolve({ width, height })
                })
                .catch(reject)

            readStream.pipe(transformer)
        })
    }
}
