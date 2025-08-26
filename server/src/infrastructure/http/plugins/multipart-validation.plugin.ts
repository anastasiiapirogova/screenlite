import fp from 'fastify-plugin'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { ZodType } from 'zod'
import { ValidationError } from '@/shared/errors/validation.error.ts'

interface FileRule {
    maxFileSize?: number
    allowedMimeTypes?: string[]
    allowArray?: boolean
    optional?: boolean
}

interface MultipartValidationOptions {
    maxFileSize?: number
}

declare module 'fastify' {
    interface FastifyInstance {
        validateMultipart: <T extends ZodType>(
            request: FastifyRequest,
            fieldSchema: T,
            fileRules?: Record<string, FileRule>,
            options?: MultipartValidationOptions
        ) => Promise<Record<string, unknown>>
    }
}

const multipartValidationPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorate('validateMultipart', async function validateMultipart<T extends ZodType>(
        request: FastifyRequest,
        fieldSchema: T,
        fileRules: Record<string, FileRule> = {},
        options: MultipartValidationOptions = {}
    ) {
        const {
            maxFileSize = 1024 * 1024 * 5,
        } = options

        const errors: Record<string, string[]> = {}

        const addError = (field: string, error: string) => {
            if (!errors[field]) {
                errors[field] = []
            }
            errors[field].push(error)
        }
        
        const hasErrors = () => {
            return Object.keys(errors).length > 0
        }

        const parts = request.parts({
            limits: {
                fileSize: Infinity,
            }
        })

        const fields: Record<string, unknown> = {}
        const files: Record<string, Buffer | Buffer[]> = {}
        const receivedFiles = new Set<string>()

        for await (const part of parts) {
            if (part.type === 'file') {
                receivedFiles.add(part.fieldname)
                const rule = fileRules[part.fieldname]

                if (!rule) {
                    part.file.resume()
                    addError(part.fieldname, 'UNREGISTERED_FILE_FIELD')
                    continue
                }

                const fileSizeLimit = rule.maxFileSize ?? maxFileSize
                const chunks: Buffer[] = []
                let totalSize = 0

                for await (const chunk of part.file) {
                    totalSize += chunk.length
                    if (totalSize > fileSizeLimit) {
                        part.file.resume()
                        addError(part.fieldname, 'FILE_SIZE_LIMIT_EXCEEDED')
                        continue
                    }
                    chunks.push(chunk)
                }

                if (!errors[part.fieldname]?.includes('FILE_SIZE_LIMIT_EXCEEDED')) {
                    const buffer = Buffer.concat(chunks)

                    if (rule.allowedMimeTypes && !rule.allowedMimeTypes.includes(part.mimetype)) {
                        part.file.resume()
                        addError(part.fieldname, 'INVALID_MIME_TYPE')
                        continue
                    }

                    if (rule.allowArray) {
                        if (!files[part.fieldname]) {
                            files[part.fieldname] = []
                        }
                        (files[part.fieldname] as Buffer[]).push(buffer)
                    } else {
                        if (files[part.fieldname]) {
                            part.file.resume()
                            addError(part.fieldname, 'MULTIPLE_FILES_FOR_NON_ARRAY_FIELD')
                            continue
                        }
                        files[part.fieldname] = buffer
                    }
                }
            } else {
                try {
                    const value = await part.value

                    fields[part.fieldname] = value
                } catch {
                    addError(part.fieldname, 'ERROR_READING_FIELD')
                    continue
                }
            }
        }

        for (const [fieldName, rule] of Object.entries(fileRules)) {
            if (!rule.optional && !receivedFiles.has(fieldName)) {
                addError(fieldName, 'MISSING_REQUIRED_FILE')
            }
        }

        if (hasErrors()) {
            throw new ValidationError(errors)
        }

        const parsedFields = fieldSchema.safeParse(fields)

        if (!parsedFields.success) {
            request.raw.resume()
            throw parsedFields.error
        }

        const result = parsedFields.data as Record<string, unknown>

        for (const [key, value] of Object.entries(files)) {
            result[key] = value
        }

        return result
    })
}

export default fp(multipartValidationPlugin, {
    name: 'multipartValidation',
})