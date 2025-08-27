export class StorageService {
    static getFileThumbnailSrc(path: string) {
        return new URL(`/api/file-delivery/thumbnail/${path}`, import.meta.env.VITE_API_URL).toString()
    }

    static getFileSrc(path: string) {
        return new URL(`/api/static/uploads/${path}`, import.meta.env.VITE_API_URL).toString()
    }
}