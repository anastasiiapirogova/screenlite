import { v4 as uuid } from 'uuid'

export const generateUniqueFileName = (filename: string) => {
    const extension = filename.split('.').pop() || ''

    const id = uuid()

    return `${id}.${extension}`
}
