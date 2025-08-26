import { IStorage } from '@/core/ports/storage.interface.ts'
import { UpdateProfileDto } from '../dto/update-profile.dto.ts'
import { IUserRepository } from '../../domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IImageValidator } from '@/core/ports/image-validator.interface.ts'
import { ProfilePhoto } from '@/core/value-objects/profile-photo.value-object.ts'
import { UserPolicy } from '../../domain/policies/user.policy.ts'
import { IJobProducer } from '@/core/ports/job-queue.interface.ts'
import { AppJobRegistry } from '@/core/ports/job-registry.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IImageProcessor } from '@/core/ports/image-processor.interface.ts'
import { ProfilePhotoSpecification } from '@/core/value-objects/profile-photo-specification.value-object.ts'
import { IUserMapper } from '../../domain/ports/user-mapper.interface.ts'

type UpdateProfileUsecaseDeps = {
    storage: IStorage
    userRepository: IUserRepository
    imageValidator: IImageValidator
    imageProcessor: IImageProcessor
    unitOfWork: IUnitOfWork
    jobProducer: IJobProducer<AppJobRegistry>
    userMapper: IUserMapper
}

export class UpdateProfileUsecase {
    constructor(private readonly deps: UpdateProfileUsecaseDeps) {}

    async execute(data: UpdateProfileDto) {
        let prevProfilePhotoPath: string | null = null

        const { storage, userRepository, imageValidator, unitOfWork, jobProducer, imageProcessor, userMapper } = this.deps
        const { profilePhotoBuffer, name, userId, removeProfilePhoto, authContext } = data

        const newPhotoSubmitted = profilePhotoBuffer && Buffer.isBuffer(profilePhotoBuffer)

        const user = await userRepository.findById(userId)

        if (!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        const userPolicy = new UserPolicy(user, authContext)

        userPolicy.enforceCanUpdateProfile()

        if (removeProfilePhoto && !newPhotoSubmitted) {
            prevProfilePhotoPath = user.removeProfilePhoto()
        }

        if (newPhotoSubmitted) {
            await imageValidator.validateProfilePhoto(profilePhotoBuffer)

            const processedPhoto = await imageProcessor.process(profilePhotoBuffer, ProfilePhotoSpecification.getDefault())

            const profilePhoto = new ProfilePhoto(processedPhoto, 'image/jpeg', userId)

            await storage.uploadFile(profilePhoto.storageKey, processedPhoto, 'profile-pictures')

            prevProfilePhotoPath = user.profilePhotoPath

            user.profilePhotoPath = profilePhoto.storageKey
        }

        user.name = name

        await unitOfWork.execute(async (tx) => {
            await tx.userRepository.save(user)

            if (prevProfilePhotoPath) {
                await jobProducer.enqueue('delete_old_profile_photo', {
                    storageKey: prevProfilePhotoPath
                })
            }
        })

        return userMapper.toDTO(user)
    }
}