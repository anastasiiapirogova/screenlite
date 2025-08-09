export type ScreenliteConfig = {
    app: {
        frontendVersion: string
        backendVersion: string
        environment: string
    }
    limits: {
        allowedFileTypes: string[]
        maxFolderDepth: number
        maxUploadFileSize: number
        maxUploadFilePartSize: number
    }
}