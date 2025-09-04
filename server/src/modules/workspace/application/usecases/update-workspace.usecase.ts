import { IStorage } from '@/core/ports/storage.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { IImageValidator } from '@/core/ports/image-validator.interface.ts'
import { IJobProducer } from '@/core/ports/job-queue.interface.ts'
import { AppJobRegistry } from '@/core/ports/job-registry.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IImageProcessor } from '@/core/ports/image-processor.interface.ts'
import { UpdateWorkspaceDTO } from '../dto/update-workspace.dto.ts'
import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'
import { WorkspacePolicy } from '../../domain/policies/workspace.policy.ts'
import { IWorkspaceAccessService } from '../../domain/ports/workspace-access-service.interface.ts'
import { WorkspacePicture } from '@/core/value-objects/workspace-picture.vo.ts'
import { Workspace } from '@/core/entities/workspace.entity.ts'
import { WorkspacePictureSpecification } from '@/core/value-objects/workspace-picture-specification.vo.ts'
import { IWorkspaceInvariantsService } from '../../domain/ports/workspace-invariants-service.interface.ts'

type UpdateWorkspaceUsecaseDeps = {
    storage: IStorage
    workspaceRepository: IWorkspaceRepository
    imageValidator: IImageValidator
    imageProcessor: IImageProcessor
    unitOfWork: IUnitOfWork
    jobProducer: IJobProducer<AppJobRegistry>
    workspaceAccessService: IWorkspaceAccessService
    workspaceInvariantsService: IWorkspaceInvariantsService
}

export class UpdateWorkspaceUsecase {
    constructor(private readonly deps: UpdateWorkspaceUsecaseDeps) {}

    async execute(data: UpdateWorkspaceDTO) {
        const { workspaceRepository, unitOfWork, workspaceAccessService, workspaceInvariantsService } = this.deps
        const { pictureBuffer, name, slug, authContext, removePicture, workspaceId } = data

        const workspace = await workspaceRepository.findById(workspaceId)

        if (!workspace) {
            throw new NotFoundError('WORKSPACE_NOT_FOUND')
        }

        const workspaceAccess = await workspaceAccessService.checkAccess(workspace.id, authContext)

        WorkspacePolicy.enforceUpdateWorkspace(authContext, workspaceAccess)

        await workspaceInvariantsService.enforceWorkspaceActiveForNonAdmin(workspace, authContext)

        if (slug !== workspace.slug) {
            await this.validateSlugUniqueness(slug, workspace.id)
        }

        const shouldUploadNewPicture = pictureBuffer && Buffer.isBuffer(pictureBuffer)

        let newPictureStorageKey: string | null = null
        let oldPicturePath: string | null = null

        try {   
            if (shouldUploadNewPicture) {
                const result = await this.handleNewPictureUpload(pictureBuffer, workspace)

                newPictureStorageKey = result.newPictureStorageKey
                oldPicturePath = result.oldPicturePath
            } else if (removePicture) {
                oldPicturePath = workspace.removePicture()
            }

            workspace.name = name
            workspace.slug = slug

            await unitOfWork.execute(async (tx) => {
                await tx.workspaceRepository.save(workspace)
                await this.scheduleCleanupJobs(oldPicturePath)
            })

            return workspace
        } catch (error) {
            await this.scheduleCleanupJobs(newPictureStorageKey)
            throw error
        }
    }

    private async validateSlugUniqueness(slug: string, currentWorkspaceId: string): Promise<void> {
        const existingWorkspace = await this.deps.workspaceRepository.findBySlug(slug)
        
        if (existingWorkspace && existingWorkspace.id !== currentWorkspaceId) {
            throw new ValidationError({
                slug: ['SLUG_ALREADY_EXISTS']
            })
        }
    }

    private async handleNewPictureUpload(pictureBuffer: Buffer, workspace: Workspace) {
        const { imageValidator, imageProcessor, storage } = this.deps

        await imageValidator.validateWorkspacePicture(pictureBuffer)

        const processedPicture = await imageProcessor.process(
            pictureBuffer,
            WorkspacePictureSpecification.getDefault()
        )

        const { buffer, mimeType } = processedPicture

        const workspacePicture = new WorkspacePicture(buffer, mimeType, workspace.id)

        await storage.uploadFile(workspacePicture.storageKey, buffer, mimeType)

        const oldPicturePath = workspace.updatePicturePath(workspacePicture.storageKey)

        return {
            newPictureStorageKey: workspacePicture.storageKey,
            oldPicturePath
        }
    }

    private async scheduleCleanupJobs(fileKey: string | null) {
        if (fileKey) {
            await this.deps.jobProducer.enqueue('delete_file_from_storage', {
                storageKey: fileKey
            })
        }
    }
}