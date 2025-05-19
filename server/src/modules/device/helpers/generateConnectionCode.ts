import crypto from 'crypto'

// Some characters are excluded because they can be easily confused with others
// (e.g., 'I' with '1', 'O' with '0') to improve readability.
const CHARACTERS = 'BCDFGHJKMPQRTVWXY346789'
const CODE_LENGTH = 6

export const generateConnectionCode = (): string => {
    let result = ''

    for (let i = 0; i < CODE_LENGTH; i++) {
        let byte: number
        const maxValidByte = 256 - (256 % CHARACTERS.length)

        do {
            byte = crypto.randomBytes(1)[0]
        } while (byte >= maxValidByte)
        result += CHARACTERS[byte % CHARACTERS.length]
    }

    return result
}