export const APP_VERSION = '0.0.1'
export const APP_NAME = 'Screenlite'
export const STORAGE_TYPE = process.env.STORAGE_TYPE?.toLowerCase() as 'local' | 's3' || 'local'
