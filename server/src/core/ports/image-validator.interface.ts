export interface IImageValidator {
    validateProfilePhoto(buffer: Buffer): Promise<void>
}