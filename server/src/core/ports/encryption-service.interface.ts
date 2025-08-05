export type IEncryptionService = {
    encrypt(plaintext: string): Promise<string>
    decrypt(ciphertext: string): Promise<string>
}