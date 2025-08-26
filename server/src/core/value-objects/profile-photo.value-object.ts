import { v4 as uuidv4 } from 'uuid'

export class ProfilePhoto {
    private readonly id: string = uuidv4()
    
    constructor(
        private readonly buffer: Buffer,
        private readonly mimeType: string,
        private readonly userId: string,
    ) {
        this.validate()
    }

    private validate() {
        if (!this.mimeType.startsWith('image/')) {
            throw new Error('INVALID_IMAGE_TYPE')
        }
    }

    get storageKey(): string {
        const extension = this.getExtension()

        return `profile-pictures/${this.userId}/${this.id}.${extension}`
    }

    get data(): Buffer {
        return this.buffer
    }

    private getExtension(): string {
        const mimeMap: Record<string, string> = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
        }

        return mimeMap[this.mimeType] ?? 'bin'
    }
}
