import fs from 'fs/promises'
import path from 'path'

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

export const cleanupTmpFolder = async () => {
    const tmpDir = path.join(__dirname, '../../tmp')

    try {
        await fs.access(tmpDir)
    } catch {
        console.log('Tmp directory does not exist.')
        return
    }

    try {
        const files = await fs.readdir(tmpDir)
        const now = Date.now()

        await Promise.all(files.map(async file => {
            const filePath = path.join(tmpDir, file)

            try {
                const stats = await fs.stat(filePath)

                if (stats.isFile()) {
                    const mtime = stats.mtime.getTime()

                    if (now - mtime > THREE_DAYS_MS) {
                        await fs.unlink(filePath)
                        console.log(`Deleted file: ${filePath}`)
                    }
                }
            } catch (err) {
                console.error(`Error processing file ${filePath}:`, err)
            }
        }))
    } catch (err) {
        console.error('Error reading tmp directory:', err)
    }
}
