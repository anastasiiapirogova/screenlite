export const sanitizeFileName = (filename: string) => {
    const maxLength = 255
    const extensionIndex = filename.lastIndexOf('.')

    if (extensionIndex === -1) {
        return filename.substring(0, maxLength)
    }

    const namePart = filename.substring(0, extensionIndex)

    return namePart.substring(0, maxLength)
}