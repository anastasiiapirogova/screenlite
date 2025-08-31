export interface IImageValidator {
    validateProfilePhoto(buffer: Buffer): Promise<void>
    validateWorkspacePicture(buffer: Buffer): Promise<void>
}