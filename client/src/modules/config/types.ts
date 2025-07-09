export type ScreenliteConfig = {
    frontend: {
        version: string
    }
    backend: {
        version: string
        environment: string
    }
    limits: {
        allowedFileTypes: string[]
        maxFolderDepth: number
        maxUploadFileSize: number
        maxUploadFilePartSize: number
    }
}