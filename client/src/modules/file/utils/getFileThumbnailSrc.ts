const API_URL = import.meta.env.VITE_API_URL

export const getFileThumbnailSrc = (path: string) => {
    return `${API_URL}/static/thumbnail/${path}`
}