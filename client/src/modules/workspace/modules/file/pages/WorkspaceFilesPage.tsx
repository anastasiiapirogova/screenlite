import { CreateFolderButton } from '../components/buttons/CreateFolderButton'
import { Button } from '@shared/ui/buttons/Button'
import { FolderList } from '../components/FileManager/FolderList'
import { FileList } from '../components/FileManager/FileList'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { FilesDndContext } from '../components/FileManager/FilesDndContext'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { useRef, useEffect } from 'react'
import { useFileViewerModal } from '../hooks/useFileViewerModal'
import { FilePreviewModal } from '../components/FilePreviewModal'
import { WorkspaceFile, ParentFolderTreeResult, FolderWithChildrenCount } from '../types'
import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useDeferredLoading } from '@shared/hooks/useDeferredLoading'
import { workspaceFolderQuery } from '../api/workspaceFolder'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { DeleteFoldersButton } from '../components/buttons/DeleteFoldersButton'
import { FolderBreadcrumbs } from '../components/FileManager/FolderBreadcrumbs'
import { useFilesPageClickHandler } from '../hooks/useFilesPageClickHandler'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'

const Sidebar = () => {
    return (
        <div className='w-[325px] shrink-0'>
            <LayoutBodyContainer>
                <ScrollArea verticalMargin={ 24 }>
                    <div>Filters</div>
                </ScrollArea>
            </LayoutBodyContainer>
        </div>
    )
}

type MainContentProps = {
    parentId?: string
    folderData?: { folder: { name: string }, parentFolders: ParentFolderTreeResult[] }
    folderId?: string
    filesPageContentRef: React.RefObject<HTMLDivElement>
    handleFileDoubleClick: (file: WorkspaceFile) => void
    handleFolderDoubleClick: (folder: FolderWithChildrenCount) => void
}

const MainContent = ({ parentId, folderData, folderId, filesPageContentRef, handleFileDoubleClick, handleFolderDoubleClick }: MainContentProps) => {
    return (
        <LayoutBodyContainer>
            <div className='flex items-center justify-between p-7 border-b border-gray-100'>
                <FolderBreadcrumbs folder={ folderData
                    ? {
                        name: folderData.folder.name,
                        parentFolders: folderData.parentFolders
                    }
                    : undefined }
                />
                <div className='flex items-center gap-2'>
                    { folderId && (
                        <DeleteFoldersButton folderIds={ folderId }>
                            <Button>Delete folder</Button>
                        </DeleteFoldersButton>
                    ) }
                    <CreateFolderButton parentId={ parentId || null }>
                        <Button>Create folder</Button>
                    </CreateFolderButton>
                </div>
            </div>
            <ScrollArea verticalMargin={ 24 }>
                <div
                    className='p-7'
                    ref={ filesPageContentRef }
                >
                    <FolderList
                        parentId={ parentId }
                        onFolderDoubleClick={ handleFolderDoubleClick }
                    />
                    <div className='mt-10'></div>
                    <FileList
                        folderId={ parentId }
                        onFileDoubleClick={ handleFileDoubleClick }
                    />
                </div>
            </ScrollArea>
        </LayoutBodyContainer>
    )
}

export const WorkspaceFilesPage = () => {
    const params = useParams<{ folderId?: string }>()
    const navigate = useNavigate()
    const folderId = params.folderId
    const routes = useWorkspaceRoutes()
    const { getEntity, clearSelection } = useSelectionStore(
        useShallow((state) => ({ getEntity: state.getEntity, clearSelection: state.clearSelection }))
    )
    const filesPageContentRef = useRef<HTMLDivElement>(null!)
    const { modalFile, openModal, closeModal } = useFileViewerModal()
    const workspace = useWorkspace()
    
    const { data: folderData, isLoading, isSuccess } = useQuery({
        ...workspaceFolderQuery({ folderId: folderId!, workspaceId: workspace.id }),
        enabled: !!folderId
    })
    const deferredIsLoading = useDeferredLoading(isLoading, { delay: 0, minDuration: 500 })
    
    useFilesPageClickHandler({
        filesPageContentRef,
        getEntity,
        clearSelection
    })
    
    const handleFileDoubleClick = (file: WorkspaceFile) => {
        openModal(file)
    }

    const handleFolderDoubleClick = (folder: FolderWithChildrenCount) => {
        navigate(routes.folder(folder.id))
    }
    
    useEffect(() => {
        clearSelection()
    }, [folderId, clearSelection])
    
    if (folderId && !isSuccess) {
        return (
            <LayoutBodyContainer>
                <div className='flex grow items-center justify-center'>
                    { deferredIsLoading ? 'Loading...' : 'Error loading folder' }
                </div>
            </LayoutBodyContainer>
        )
    }
    
    const parentId = folderId || undefined
    
    return (
        <FilesDndContext>
            <div className='flex gap-2 grow'>
                <Sidebar />
                <MainContent
                    parentId={ parentId }
                    folderData={ folderData }
                    folderId={ folderId }
                    filesPageContentRef={ filesPageContentRef }
                    handleFileDoubleClick={ handleFileDoubleClick }
                    handleFolderDoubleClick={ handleFolderDoubleClick }
                />
            </div>
            <FilePreviewModal
                open={ !!modalFile }
                file={ modalFile }
                onClose={ closeModal }
            />
        </FilesDndContext>
    )
}
