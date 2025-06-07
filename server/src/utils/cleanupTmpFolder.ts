import fs from 'fs/promises'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

export const cleanupTmpFolder = async () => {
    console.log('Cleaning up tmp folder...')
    const tmpDir = path.join(__dirname, '../../tmp')

    try {
        await fs.access(tmpDir)
    } catch {
        return
    }

    const cleanupRecursive = async (dir: string) => {
        let entries: string[]

        try {
            entries = await fs.readdir(dir)
        } catch (err) {
            console.error(`Error reading directory ${dir}:`, err)
            return
        }

        await Promise.all(entries.map(async entry => {
            const entryPath = path.join(dir, entry)

            try {
                const stats = await fs.stat(entryPath)

                if (stats.isDirectory()) {
                    await cleanupRecursive(entryPath)

                    const remaining = await fs.readdir(entryPath)

                    if (remaining.length === 0) {
                        await fs.rmdir(entryPath)
                        console.log(`Deleted empty directory: ${entryPath}`)
                    }
                } else if (stats.isFile()) {
                    const mtime = stats.mtime.getTime()

                    if (Date.now() - mtime > THREE_DAYS_MS) {
                        await fs.unlink(entryPath)
                        console.log(`Deleted file: ${entryPath}`)
                    }
                }
            } catch (err) {
                console.error(`Error processing ${entryPath}:`, err)
            }
        }))
    }

    await cleanupRecursive(tmpDir)
}
