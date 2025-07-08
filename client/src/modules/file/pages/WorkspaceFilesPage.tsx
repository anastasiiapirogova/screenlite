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
    folderId?: string
    folderData?: { folder: { name: string }, parentFolders: ParentFolderTreeResult[] }
    filesPageContentRef: React.RefObject<HTMLDivElement>
    handleFileDoubleClick: (file: WorkspaceFile) => void
    handleFolderDoubleClick: (folder: FolderWithChildrenCount) => void
}

const MainContent = ({ folderId, folderData, filesPageContentRef, handleFileDoubleClick, handleFolderDoubleClick }: MainContentProps) => {
    return (
        <LayoutBodyContainer>
            <div className='flex items-center justify-between p-7 border-b border-gray-100'>
                <FolderBreadcrumbs folderData={ folderData }/>
                <div className='flex items-center gap-2'>
                    <CreateFolderButton parentId={ folderId || null }>
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
                        parentId={ folderId }
                        onFolderDoubleClick={ handleFolderDoubleClick }
                    />
                    <div className='mt-10'></div>
                    <FileList
                        folderId={ folderId }
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

    if (folderData && folderData.folder.deletedAt) {
        return (
            <LayoutBodyContainer>
                <div className='flex grow items-center justify-center'>
                    This folder has been deleted
                </div>
            </LayoutBodyContainer>
        )
    }
    
    return (
        <FilesDndContext>
            <div className='flex gap-2 grow'>
                <Sidebar />
                <MainContent
                    folderId={ folderId }
                    folderData={ folderData }
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
