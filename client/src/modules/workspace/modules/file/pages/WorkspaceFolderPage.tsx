import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useDeferredLoading } from '@shared/hooks/useDeferredLoading'
import { workspaceFolderQuery, WorkspaceFolderRequestResponse } from '../api/workspaceFolder'
import { CreateFolderButton } from '../components/buttons/CreateFolderButton'
import { Button } from '@shared/ui/buttons/Button'
import { FolderList } from '../components/FolderList'
import { FileList } from '../components/FileList'
import { DeleteFoldersButton } from '../components/buttons/DeleteFoldersButton'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { ListPageHeader } from '@shared/components/ListPageHeader'
import { useRouterSearch } from '@/shared/hooks/useRouterSearch'
import { Input } from '@shared/ui/input/Input'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { FilesDndContext } from '../components/FilesDndContext'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { useEffect, useRef } from 'react'
import { FolderBreadcrumbs } from '../components/FolderBreadcrumbs'

const WorkspaceFolder = ({ data }: { data: WorkspaceFolderRequestResponse }) => {
    const { searchTerm, setSearchTerm } = useRouterSearch()
    const { getEntity, clearSelection } = useSelectionStore(useShallow((state) => ({
        getEntity: state.getEntity,
        clearSelection: state.clearSelection,
    })))
    const folderPageContentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const currentEntity = getEntity()
            
            if (!currentEntity || !folderPageContentRef.current) return

            const isInsideFolderPage = folderPageContentRef.current.contains(target)
            
            if (!isInsideFolderPage) {
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
                    <ListPageHeader title={ data.folder.name }>
                        <div className='flex items-center gap-2'>
                            <FolderBreadcrumbs 
                                parentFolders={ data.parentFolders }
                                currentFolderName={ data.folder.name }
                            />
                            <DeleteFoldersButton folderIds={ data.folder.id }>
                                <Button>
                                    Delete folder
                                </Button>
                            </DeleteFoldersButton>
                            <CreateFolderButton parentId={ data.folder.id }>
                                <Button>
                                    Create folder
                                </Button>
                            </CreateFolderButton>
                        </div>
                    </ListPageHeader>
                    <ScrollArea verticalMargin={ 24 }>
                        <div
                            className='p-7'
                            ref={ folderPageContentRef }
                        >
                            <FolderList parentId={ data.folder.id }/>
                            <div className='mt-10'>
                            </div>
                            <FileList folderId={ data.folder.id }/>
                        </div>
                    </ScrollArea>
                </LayoutBodyContainer>
            </div>
        </FilesDndContext>
    )
}

export const WorkspaceFolderPage = () => {
    const params = useParams<{ folderId: string }>()
    const workspace = useWorkspace()
    
    const { data, isLoading, isSuccess } = useQuery(workspaceFolderQuery({
        folderId: params.folderId!,
        workspaceId: workspace.id
    }))

    const deferredIsLoading = useDeferredLoading(isLoading, { delay: 0, minDuration: 500 })

    if(!isSuccess) {
        return (
            <LayoutBodyContainer>
                <div className='flex grow items-center justify-center'>
                    { deferredIsLoading ? 'Loading...' : 'Error loading folder' }
                </div>
            </LayoutBodyContainer>
        )
    }

    return (
        <WorkspaceFolder data={ data }/>
    )
}
