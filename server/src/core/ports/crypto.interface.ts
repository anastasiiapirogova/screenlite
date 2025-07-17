export type CryptoServiceInterface = {
    encrypt(plaintext: string): string
    decrypt(ciphertext: string): string
}