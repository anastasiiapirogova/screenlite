import { MultipartFileUploaderService } from '@modules/workspace/modules/fileUpload/services/multipartFileUploader/MultipartFileUploaderService.js'
import { StorageService } from '@services/storage/StorageService.js'

const storageInstance = StorageService.getInstance()

export const Storage = storageInstance

const multipartFileUploaderInstance = MultipartFileUploaderService.getInstance()

export const MultipartFileUploader = multipartFileUploaderInstance