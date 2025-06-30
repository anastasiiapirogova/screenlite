import { FileUploadingData, FileUploadError, FileUploadConfig, FileUploadSession } from '../types'
import { createFileUploadSessionRequest } from '../api/createFileUploadSession'
import { uploadFilePartRequest } from '../api/uploadFilePart'
import axios, { AxiosError } from 'axios'
import { cancelFileUploading } from '../utils/cancelFileUploading'

const DEFAULT_CONFIG: FileUploadConfig = {
    chunkSize: 20 * 1024 * 1024,
    maxConcurrentUploads: 5,
    timeout: 30000,
}

type UploadStateListener = (queue: FileUploadingData[]) => void

export class FileUploadService {
    private queue: FileUploadingData[] = []
    private currentlyUploading = new Set<string>()
    private abortControllers: Map<string, AbortController> = new Map()
    private listeners: UploadStateListener[] = []
    private config: FileUploadConfig
    private isDestroyed = false

    constructor(config: Partial<FileUploadConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }
    }

    subscribe(listener: UploadStateListener) {
        if (this.isDestroyed) return () => {}
        
        this.listeners.push(listener)
        listener(this.queue)

        return () => {
            this.listeners = this.listeners.filter(l => l !== listener)
        }
    }

    private notifyListeners() {
        if (this.isDestroyed) return
        this.listeners.forEach(listener => listener([...this.queue]))
    }

    getQueue() {
        return [...this.queue]
    }

    getCurrentlyUploading() {
        return Array.from(this.currentlyUploading)
    }

    isUploading(id: string) {
        return this.currentlyUploading.has(id)
    }

    addFiles(files: File[], workspaceId: string, folderId: string | null = null) {
        if (this.isDestroyed) return

        const addedFiles: FileUploadingData[] = []

        files.forEach(file => {
            addedFiles.push({
                id: crypto.randomUUID(),
                file,
                workspaceId,
                folderId,
                session: null,
                progress: 0,
                status: 'pending',
                error: null,
                retryCount: 0,
                completed: false,
            })
        })

        this.queue = [...this.queue, ...addedFiles]
        this.notifyListeners()
        this.startNextPendingUpload()

        return addedFiles
    }

    async cancelUpload(id: string) {
        if (this.isDestroyed) return

        const fileData = this.queue.find(f => f.id === id)

        if (fileData?.session) {
            try {
                await cancelFileUploading(fileData.session.id, fileData.session.workspaceId)
            } catch (error) {
                console.warn('Failed to cancel upload on server:', error)
            }
        }

        const abortController = this.abortControllers.get(id)

        if (abortController) {
            abortController.abort()
            this.abortControllers.delete(id)
        }
        
        this.currentlyUploading.delete(id)
        
        this.queue = this.queue.filter(file => file.id !== id)
        this.notifyListeners()
    }

    pauseUpload(id: string) {
        if (this.isDestroyed) return

        const abortController = this.abortControllers.get(id)

        if (abortController) {
            abortController.abort()
            this.abortControllers.delete(id)
        }
        
        this.currentlyUploading.delete(id)
        this.updateFile(id, { status: 'paused' })
        this.startNextPendingUpload()
    }

    resumeFile(id: string) {
        if (this.isDestroyed) return

        this.updateFile(id, { 
            error: null, 
            errorMessage: undefined,
            status: 'pending'
        })
        this.startNextPendingUpload()
    }

    async restartUploading(id: string) {
        if (this.isDestroyed) return

        const fileData = this.queue.find(f => f.id === id)

        if (!fileData) return

        await this.cancelUpload(id)
        
        const newFileData: FileUploadingData = {
            ...fileData,
            error: null,
            errorMessage: undefined,
            progress: 0,
            session: null,
            retryCount: 0,
            status: 'pending',
            completed: false,
        }
        
        this.queue = [...this.queue, newFileData]
        this.notifyListeners()
        this.startNextPendingUpload()
    }

    async emptyQueue() {
        if (this.isDestroyed) return

        const cancelPromises = this.queue
            .filter(file => this.currentlyUploading.has(file.id))
            .map(file => this.cancelUpload(file.id))
        
        await Promise.all(cancelPromises)

        this.queue = []
        this.notifyListeners()
    }

    private updateFile(id: string, updates: Partial<FileUploadingData>) {
        if (this.isDestroyed) return

        this.queue = this.queue.map(file => 
            file.id === id ? { ...file, ...updates } : file
        )
        this.notifyListeners()
    }

    private startNextPendingUpload() {
        if (this.isDestroyed) return

        const pendingFiles = this.queue.filter(file => 
            file.status === 'pending' && 
            !this.currentlyUploading.has(file.id) &&
            (!file.session || parseInt(file.session.uploaded.toString()) < file.file.size)
        )
        
        const availableSlots = this.config.maxConcurrentUploads - this.currentlyUploading.size
        const filesToStart = pendingFiles.slice(0, availableSlots)
        
        filesToStart.forEach(file => {
            this.currentlyUploading.add(file.id)
            this.uploadFile(file)
        })
    }

    private async uploadFile(fileData: FileUploadingData) {
        const { id, file, session, error } = fileData
        
        if (!fileData || error) {
            this.currentlyUploading.delete(id)
            this.startNextPendingUpload()
            return
        }

        this.updateFile(id, { 
            status: 'uploading',
            startedAt: new Date()
        })
        
        let uploadSession = session
        
        if (!uploadSession) {
            try {
                uploadSession = await this.createUploadSession(fileData)
                this.updateFile(id, { session: uploadSession })
            } catch (error) {
                const uploadError = this.mapErrorToUploadError(error)

                this.handleUploadError(id, uploadError)
                return
            }
        }
        
        await this.uploadFileParts(id, file, uploadSession, fileData.workspaceId)
    }

    private async createUploadSession(fileData: FileUploadingData): Promise<FileUploadSession> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

        try {
            const session = await createFileUploadSessionRequest({
                workspaceId: fileData.workspaceId,
                name: fileData.file.name,
                size: fileData.file.size,
                mimeType: fileData.file.type,
                folderId: fileData.folderId || undefined,
            })

            clearTimeout(timeoutId)
            return session
        } catch (error) {
            clearTimeout(timeoutId)
            throw error
        }
    }

    private async uploadFileParts(id: string, file: File, uploadSession: FileUploadSession, workspaceId: string) {
        let uploaded = parseInt(uploadSession.uploaded.toString())
        const size = file.size
        
        while (uploaded < size) {
            const currentFileData = this.queue.find(file => file.id === id)

            if (!currentFileData || currentFileData.error) {
                break
            }
            
            const chunk = file.slice(uploaded, Math.min(uploaded + this.config.chunkSize, size))
            const abortController = new AbortController()
            const originalUploaded = uploaded

            this.abortControllers.set(id, abortController)
            
            try {
                const updatedSession = await this.uploadChunk(
                    chunk,
                    uploadSession.id,
                    workspaceId,
                    abortController,
                    originalUploaded,
                    file.size,
                    id
                )
                
                this.updateFile(id, { session: updatedSession })
                uploadSession = updatedSession
                uploaded = parseInt(updatedSession.uploaded.toString())
            } catch (error) {
                if (abortController.signal.aborted) {
                    this.updateFile(id, { 
                        progress: (originalUploaded / file.size) * 100 
                    })
                    break
                }
                
                this.updateFile(id, { 
                    progress: (originalUploaded / file.size) * 100 
                })
                
                const uploadError = this.mapErrorToUploadError(error)

                this.handleUploadError(id, uploadError)
                break
            }
        }
        
        this.finishUpload(id)
    }

    private async uploadChunk(
        chunk: Blob,
        sessionId: string,
        workspaceId: string,
        abortController: AbortController,
        originalUploaded: number,
        fileSize: number,
        fileId: string
    ): Promise<FileUploadSession> {
        return await uploadFilePartRequest({
            filePart: chunk,
            sessionId,
            workspaceId,
            onProgress: (progressEvent) => {
                const uploaded = originalUploaded + progressEvent.loaded
                const progress = (uploaded / fileSize) * 100

                this.updateFile(fileId, { progress })
            },
            abortController,
        })
    }

    private handleUploadError(id: string, error: FileUploadError) {
        const currentFile = this.queue.find(f => f.id === id)

        if (!currentFile) return

        this.updateFile(id, { 
            error,
            errorMessage: this.getErrorMessage(error),
            status: 'error',
            retryCount: currentFile.retryCount + 1
        })

        this.currentlyUploading.delete(id)
        this.abortControllers.delete(id)
    }

    private mapErrorToUploadError(error: unknown): FileUploadError {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError
            
            if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
                return 'TIMEOUT_ERROR'
            }
            
            if (axiosError.code === 'ERR_NETWORK') {
                return 'NETWORK_ERROR'
            }
            
            switch (axiosError.response?.status) {
                case 401:
                    return 'INSUFFICIENT_PERMISSIONS'
                case 403:
                    return 'INSUFFICIENT_PERMISSIONS'
                case 404:
                    return 'WORKSPACE_NOT_FOUND'
                case 413:
                    return 'FILE_TOO_LARGE'
                case 429:
                    return 'QUOTA_EXCEEDED'
                case 500:
                case 502:
                case 503:
                case 504:
                    return 'SERVER_ERROR'
                default:
                    return 'UNKNOWN_ERROR'
            }
        }
        
        return 'UNKNOWN_ERROR'
    }

    private getErrorMessage(error: FileUploadError): string {
        const errorMessages: Record<FileUploadError, string> = {
            NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
            SESSION_INIT_FAILED: 'Failed to initialize upload session.',
            FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
            INVALID_FILE_TYPE: 'File type is not supported.',
            INSUFFICIENT_PERMISSIONS: 'You do not have permission to upload files to this workspace.',
            WORKSPACE_NOT_FOUND: 'Workspace not found.',
            QUOTA_EXCEEDED: 'Upload quota exceeded.',
            SERVER_ERROR: 'Server error occurred. Please try again later.',
            UPLOAD_CANCELLED: 'Upload was cancelled.',
            TIMEOUT_ERROR: 'Upload timed out. Please try again.',
            UNKNOWN_ERROR: 'An unexpected error occurred.'
        }

        return errorMessages[error] || 'An unexpected error occurred.'
    }

    private finishUpload(id: string) {
        this.currentlyUploading.delete(id)
        this.abortControllers.delete(id)
        
        const fileData = this.queue.find(f => f.id === id)

        if (fileData && !fileData.error) {
            this.updateFile(id, { 
                status: 'completed',
                progress: 100,
                completedAt: new Date(),
                completed: true
            })
        }
        
        this.startNextPendingUpload()
    }

    destroy() {
        this.isDestroyed = true
        this.emptyQueue()
        this.listeners = []
        this.abortControllers.clear()
        this.currentlyUploading.clear()
    }
}

export const fileUploadService = new FileUploadService() 