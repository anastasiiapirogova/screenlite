import { prisma } from '@config/prisma.js'
import { FileUploadSession } from '@generated/prisma/client.js'

export const updateFileUploadSession = async (fileUploadSession: FileUploadSession, receivedBytes: number) => {
    return await prisma.fileUploadSession.update({
        where: {
            id: fileUploadSession.id,
        },
        data: {
            uploaded: fileUploadSession.uploaded + BigInt(receivedBytes),
            parts: fileUploadSession.parts + 1,
            completedAt: fileUploadSession.uploaded + BigInt(receivedBytes) === fileUploadSession.size ? new Date() : null,
        },
    })
}