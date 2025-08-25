export interface IImageValidator {
    validateProfilePicture(buffer: Buffer): Promise<void>
}