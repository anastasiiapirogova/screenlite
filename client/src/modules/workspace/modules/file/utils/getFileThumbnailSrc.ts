export const getFileThumbnailSrc = (path: string) => {
    return new URL(`/api/static/thumbnail/${path}`, import.meta.env.VITE_API_URL).toString()
}