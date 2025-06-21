import path from 'path'

export const supportedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mkv',
    'video/x-matroska',
    'video/webm'
]

export const MAX_FOLDER_DEPTH = 10

export const MAX_UPLOAD_FILE_PART_SIZE = 100 * 1024 * 1024

export const STORAGE_BASE_DIR = process.env.STORAGE_BASE_DIR || 'storage'

export const STORAGE_UPLOADS_DIR = path.join(STORAGE_BASE_DIR, 'uploads')

export const STORAGE_MULTIPART_UPLOADS_DIR = path.join(STORAGE_BASE_DIR, 'multipartUploads')