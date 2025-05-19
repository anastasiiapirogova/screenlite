import crypto from 'crypto'

export const generateConnectionCode = (): string => {
    // Some characters are excluded because they can be easily confused with others
    // (e.g., 'I' with '1', 'O' with '0') to improve readability.
    const characters = 'BCDFGHJKMPQRTVWXY346789'

    let result = ''

    const bytes = crypto.randomBytes(6)

    for (let i = 0; i < 6; i++) {
        let byte;
        do {
            byte = crypto.randomBytes(1)[0];
        } while (byte >= 256 - (256 % characters.length));
        result += characters.charAt(byte % characters.length);
    }

    return result
}