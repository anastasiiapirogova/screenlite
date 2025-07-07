import { MultipartFileUploaderService } from '@/modules/fileUpload/services/multipartFileUploader/MultipartFileUploaderService.ts'
import { StorageService } from '@/services/storage/StorageService.ts'

const storageInstance = StorageService.getInstance()

export const Storage = storageInstance

const multipartFileUploaderInstance = MultipartFileUploaderService.getInstance()

export const MultipartFileUploader = multipartFileUploaderInstance