import { Request, Response } from 'express'
import { z } from 'zod'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { removeUndefinedFromObject } from '@utils/removeUndefinedFromObject.js'
import { updateUserSchema, userIdSchema, userProfilePhotoSchema } from '../schemas/userSchemas.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserPolicy } from '../policies/userPolicy.js'
import { StorageHelper } from '@services/StorageHelper.js'

export const updateUser = async (req: Request, res: Response) => {
    const user = req.user!
    const { userId } = req.params
    const { name } = req.body
    const profilePhoto = req.file

    try {
        userIdSchema.parse({
            userId,
        })

        const userToUpdate = await UserRepository.findUserById(userId)

        if (!userToUpdate) {
            return ResponseHandler.notFound(req, res)
        }

        const allowed = UserPolicy.canUpdateUser(user, userId)

        if (!allowed) {
            return ResponseHandler.forbidden(req, res)
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

                return ResponseHandler.validationError(req, res, { profilePhoto: firstError.message })
            }

            const path = `users/${userId}/photo.jpg`

            try {
                await StorageHelper.uploadAndProcessImage(path, profilePhoto.buffer, {
                    width: 514,
                    height: 514,
                    format: 'webp'
                })
                result.profilePhoto = path
            } catch {
                return ResponseHandler.validationError(req, res, { profilePhoto: 'PROFILE_PHOTO_UPLOAD_FAILED' })
            }

            if(userToUpdate.profilePhoto !== path) {
                result.profilePhoto = path
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
            user: {
                ...user,
                ...updatedUser
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return ResponseHandler.zodError(req, res, error.errors)
        }

        throw error
    }
}
