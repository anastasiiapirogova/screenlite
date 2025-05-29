import { Request, Response } from 'express'
import { z } from 'zod'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { removeUndefinedFromObject } from '@utils/removeUndefinedFromObject.js'
import { updateUserSchema, userIdSchema, userProfilePhotoSchema } from '../schemas/userSchemas.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserPolicy } from '../policies/userPolicy.js'
import { uploadProfilePhotoToS3 } from '../utils/uploadProfilePhotoToS3.js'

export const updateUser = async (req: Request, res: Response) => {
    const user = req.user!
    const { name, userId } = req.body
    const profilePhoto = req.file

    try {
        userIdSchema.parse(req.body)

        const userToUpdate = await UserRepository.findUserById(userId)

        if (!userToUpdate) {
            return ResponseHandler.notFound(res)
        }

        const allowed = UserPolicy.canUpdateUser(user, userId)

        if (!allowed) {
            return ResponseHandler.forbidden(res)
        }

        const updatedUserData = {
            name: name !== userToUpdate.name ? name : undefined,
            profilePhoto: undefined,
        }

        const result = await updateUserSchema.parseAsync(updatedUserData)

        if (profilePhoto) {
            const validation = userProfilePhotoSchema.safeParse({ profilePhoto })

            if(!validation.success) {
                const firstError = validation.error.errors[0]

                return ResponseHandler.validationError(req, res, { profilePhoto: firstError.message})
            }

            const profilePhotoPath = await uploadProfilePhotoToS3(userId, profilePhoto)

            if (!profilePhotoPath) {
                return ResponseHandler.validationError(req, res, { profilePhoto: 'PROFILE_PHOTO_UPLOAD_FAILED' })
            }

            if(userToUpdate.profilePhoto !== profilePhotoPath ) {
                result.profilePhoto = profilePhotoPath
            }
        }

        const data = removeUndefinedFromObject(result)

        if (Object.keys(data).length === 0) {
            return ResponseHandler.json(res, {
                user: userToUpdate,
            })
        }

        const updatedUser = await UserRepository.updateUser(userId, data)

        return ResponseHandler.json(res, {
            user: updatedUser,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return ResponseHandler.zodError(req, res, error.errors)
        }

        throw error
    }
}
