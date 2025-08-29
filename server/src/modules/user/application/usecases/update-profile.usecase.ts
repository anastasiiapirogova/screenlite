import { IStorage } from '@/core/ports/storage.interface.ts'
import { UpdateProfileDto } from '../dto/update-profile.dto.ts'
import { IUserRepository } from '../../domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IImageValidator } from '@/core/ports/image-validator.interface.ts'
import { ProfilePhoto } from '@/core/value-objects/profile-photo.vo.ts'
import { UserPolicy } from '../../domain/policies/user.policy.ts'
import { IJobProducer } from '@/core/ports/job-queue.interface.ts'
import { AppJobRegistry } from '@/core/ports/job-registry.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IImageProcessor } from '@/core/ports/image-processor.interface.ts'
import { ProfilePhotoSpecification } from '@/core/value-objects/profile-photo-specification.vo.ts'
import { User } from '@/core/entities/user.entity.ts'

type UpdateProfileUsecaseDeps = {
    storage: IStorage
    userRepository: IUserRepository
    imageValidator: IImageValidator
    imageProcessor: IImageProcessor
    unitOfWork: IUnitOfWork
    jobProducer: IJobProducer<AppJobRegistry>
}

export class UpdateProfileUsecase {
    constructor(private readonly deps: UpdateProfileUsecaseDeps) {}

    async execute(data: UpdateProfileDto) {
        const { userRepository, unitOfWork } = this.deps
        const { profilePhotoBuffer, name, userId, removeProfilePhoto, authContext } = data

        const user = await userRepository.findById(userId)

        if (!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        UserPolicy.enforceCanUpdateProfile(userId, authContext)

        const shouldUploadNewPhoto = profilePhotoBuffer && Buffer.isBuffer(profilePhotoBuffer)

        let newPhotoStorageKey: string | null = null
        let oldPhotoPath: string | null = null

        try {
            if (shouldUploadNewPhoto) {
                const result = await this.handleNewPhotoUpload(profilePhotoBuffer, user)

                newPhotoStorageKey = result.newPhotoStorageKey
                oldPhotoPath = result.oldPhotoPath
            } else if (removeProfilePhoto) {
                oldPhotoPath = user.removeProfilePhoto()
            }

            user.name = name

            await unitOfWork.execute(async (tx) => {
                await tx.userRepository.save(user)
                await this.scheduleCleanupJobs(oldPhotoPath)
            })

            return user
        } catch (error) {
            await this.scheduleCleanupJobs(newPhotoStorageKey)
            throw error
        }
    }

    private async handleNewPhotoUpload(photoBuffer: Buffer, user: User) {
        const { imageValidator, imageProcessor, storage } = this.deps

        await imageValidator.validateProfilePhoto(photoBuffer)

        const mimeType = 'image/jpeg'

        const processedPhoto = await imageProcessor.process(
            photoBuffer,
            ProfilePhotoSpecification.getDefault()
        )

        const profilePhoto = new ProfilePhoto(processedPhoto, mimeType, user.id)

        await storage.uploadFile(profilePhoto.storageKey, processedPhoto, mimeType)

        const oldPhotoPath = user.updateProfilePhotoPath(profilePhoto.storageKey)

        return {
            newPhotoStorageKey: profilePhoto.storageKey,
            oldPhotoPath
        }
    }

    private async scheduleCleanupJobs(oldPhotoPath: string | null) {
        if (oldPhotoPath) {
            await this.deps.jobProducer.enqueue('delete_profile_photo', {
                storageKey: oldPhotoPath
            })
        }
    }
}