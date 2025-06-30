import { useRouterSearch } from '@/shared/hooks/useRouterSearch'
import { Input } from '@shared/ui/input/Input'
import { CreateFolderButton } from '../components/buttons/CreateFolderButton'
import { Button } from '@shared/ui/buttons/Button'
import { FolderList } from '../components/FileManager/FolderList'
import { FileList } from '../components/FileManager/FileList'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { FilesDndContext } from '../components/FileManager/FilesDndContext'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { useEffect, useRef } from 'react'
import { useFileViewerModal } from '../hooks/useFileViewerModal'
import { FilePreviewModal } from '../components/FilePreviewModal'
import { WorkspaceFile } from '../types'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useDeferredLoading } from '@shared/hooks/useDeferredLoading'
import { workspaceFolderQuery } from '../api/workspaceFolder'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { DeleteFoldersButton } from '../components/buttons/DeleteFoldersButton'
import { FolderBreadcrumbs } from '../components/FileManager/FolderBreadcrumbs'

const WorkspaceFilesContent = ({ folderId }: { folderId?: string }) => {
    const { searchTerm, setSearchTerm } = useRouterSearch()
    const { getEntity, clearSelection } = useSelectionStore(useShallow((state) => ({
        getEntity: state.getEntity,
        clearSelection: state.clearSelection,
    })))
    const filesPageContentRef = useRef<HTMLDivElement>(null)
    const { modalFile, openModal, closeModal } = useFileViewerModal()
    const workspace = useWorkspace()

    const { data: folderData, isLoading, isSuccess } = useQuery({
        ...workspaceFolderQuery({
            folderId: folderId!,
            workspaceId: workspace.id
        }),
        enabled: !!folderId
    })

    const deferredIsLoading = useDeferredLoading(isLoading, { delay: 0, minDuration: 500 })

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const currentEntity = getEntity()
            
            if (!currentEntity || !filesPageContentRef.current) return

            const isInsideFilesPage = filesPageContentRef.current.contains(target)
            
            const isClickOnContextMenu = target.closest('[data-floating-ui-portal]') ||
                                        target.closest('[data-floating-ui]')
            
            if (isClickOnContextMenu) {
                return
            }
            
            if (!isInsideFilesPage) {
                clearSelection()
                return
            }

            const isClickOnFile = target.closest('[data-entity="file"]')
            const isClickOnFolder = target.closest('[data-entity="folder"]')
            
            if (currentEntity === 'file' && !isClickOnFile) {
                clearSelection()
            } else if (currentEntity === 'folder' && !isClickOnFolder) {
                clearSelection()
            }
        }

        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [getEntity, clearSelection])

    const handleFileDoubleClick = (file: WorkspaceFile) => {
        openModal(file)
    }

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
                <div className='w-[325px] shrink-0'>
                    <LayoutBodyContainer>
                        <ScrollArea verticalMargin={ 24 }>
                            <div className='p-7'>
                                <Input
                                    value={ searchTerm }
                                    onChange={ (e) => setSearchTerm(e.target.value) }
                                    placeholder="Search..."
                                />
                            </div>
                        </ScrollArea>
                    </LayoutBodyContainer>
                </div>

                <LayoutBodyContainer>
                    <div className='flex items-center justify-between p-7 border-b border-gray-100'>
                        <FolderBreadcrumbs folder={
                            folderData ? {
                                name: folderData.folder.name,
                                parentFolders: folderData.parentFolders
                            } : undefined } 
                        />
                        <div className='flex items-center gap-2'>
                            { folderId && (
                                <DeleteFoldersButton folderIds={ folderId }>
                                    <Button>
                                        Delete folder
                                    </Button>
                                </DeleteFoldersButton>
                            ) }
                            <CreateFolderButton parentId={ parentId || null }>
                                <Button>
                                    Create folder
                                </Button>
                            </CreateFolderButton>
                        </div>
                    </div>
                    <ScrollArea verticalMargin={ 24 }>
                        <div
                            className='p-7'
                            ref={ filesPageContentRef }
                        >
                            <FolderList parentId={ parentId } />
                            <div className='mt-10'>
                            </div>
                            <FileList 
                                folderId={ parentId }
                                onFileDoubleClick={ handleFileDoubleClick } 
                            />
                        </div>
                    </ScrollArea>
                </LayoutBodyContainer>
            </div>

            <FilePreviewModal
                open={ !!modalFile }
                file={ modalFile }
                onClose={ closeModal }
            />
        </FilesDndContext>
    )
}

export const WorkspaceFilesPage = () => {
    const params = useParams<{ folderId?: string }>()
    
    return <WorkspaceFilesContent folderId={ params.folderId } />
}
