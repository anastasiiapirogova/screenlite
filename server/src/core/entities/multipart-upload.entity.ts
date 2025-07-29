export class MultipartUpload {
    private _uploadId: string | null = null
  
    constructor(
        public readonly path: string,
        public readonly mimeType: string
    ) {}
  
    get uploadId(): string {
        if (!this._uploadId) {
            throw new Error('Upload not initialized')
        }
        
        return this._uploadId
    }
  
    setUploadId(uploadId: string): void {
        this._uploadId = uploadId
    }
  
    get isInitialized(): boolean {
        return this._uploadId !== null
    }
}