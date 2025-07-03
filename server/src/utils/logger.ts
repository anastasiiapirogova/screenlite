import fs from 'fs'
import path from 'path'

const DEFAULT_LOG_DIR = path.resolve(process.cwd(), 'logs')
const DEFAULT_CATEGORY = 'app'

function ensureLogDir(logDir: string) {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
    }
}

function getLogFilePath(category: string, logDir: string) {
    const date = new Date().toISOString().slice(0, 10)

    return path.join(logDir, `${category}-${date}.log`)
}

export function info(message: string, options?: { category?: string, logDir?: string }) {
    const timestamp = new Date().toISOString()
    const category = options?.category || DEFAULT_CATEGORY
    const logDir = options?.logDir || DEFAULT_LOG_DIR

    ensureLogDir(logDir)
    const logMessage = `[${timestamp}] INFO: ${message}\n`

    fs.appendFileSync(getLogFilePath(category, logDir), logMessage)
}

export function error(message: string, err?: unknown, options?: { category?: string, logDir?: string }) {
    const timestamp = new Date().toISOString()
    const category = options?.category || DEFAULT_CATEGORY
    const logDir = options?.logDir || DEFAULT_LOG_DIR

    ensureLogDir(logDir)
    const errorMsg = err instanceof Error ? err.stack || err.message : err ? String(err) : ''
    const logMessage = `[${timestamp}] ERROR: ${message}${errorMsg ? ' | ' + errorMsg : ''}\n`

    fs.appendFileSync(getLogFilePath(category, logDir), logMessage)
} 