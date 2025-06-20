import { MAX_UPLOAD_FILE_PART_SIZE } from '@config/files.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response } from 'express'

const MIN_PART_SIZE = 5n * 1024n * 1024n // 5MB

type UploadSessionValidation = {
    size: bigint
    uploaded: bigint
}

export class ContentLengthValidator {
    static validate(
        req: Request,
        res: Response,
        session: UploadSessionValidation
    ): bigint | undefined {
        const contentLengthHeader = req.headers['content-length']

        if (!contentLengthHeader) {
            ResponseHandler.validationError(req, res, { file: 'CONTENT_LENGTH_IS_REQUIRED' })
            return undefined
        }

        const contentLength = BigInt(contentLengthHeader)

        if (contentLength > BigInt(MAX_UPLOAD_FILE_PART_SIZE)) {
            ResponseHandler.validationError(req, res, { file: 'FILE_PART_TOO_LARGE' })
            return undefined
        }

        const remainingBytes = session.size - session.uploaded
        const isFinalChunk = remainingBytes <= MIN_PART_SIZE

        if (!isFinalChunk && contentLength < MIN_PART_SIZE) {
            ResponseHandler.validationError(req, res, { file: 'FILE_PART_SIZE_TOO_SMALL' })
            return undefined
        }

        if (isFinalChunk && contentLength !== remainingBytes) {
            ResponseHandler.validationError(req, res, { file: 'FILE_PART_SIZE_INVALID' })
            return undefined
        }

        return contentLength
    }
}