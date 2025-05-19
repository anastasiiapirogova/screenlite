export const shortenFileName = (filename: string, maxLength: number) => {
    const dotIndex = filename.lastIndexOf('.')
    const nameWithoutExtension = dotIndex !== -1 ? filename.slice(0, dotIndex) : filename

    if (nameWithoutExtension.length <= maxLength) {
        return nameWithoutExtension
    }

    const shortenedName = nameWithoutExtension.slice(0, maxLength)

    return shortenedName
}
