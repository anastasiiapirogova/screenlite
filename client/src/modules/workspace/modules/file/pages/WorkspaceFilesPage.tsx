import { ListPageHeader } from '@shared/components/ListPageHeader'
import { useRouterSearch } from '@/shared/hooks/useRouterSearch'
import { Input } from '@shared/ui/input/Input'
import { CreateFolderButton } from '../components/buttons/CreateFolderButton'
import { Button } from '@shared/ui/buttons/Button'
import { FolderList } from '../components/FolderList'
import { FileList } from '../components/FileList'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { FilesDndContext } from '../components/FilesDndContext'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { useEffect, useRef } from 'react'

export const WorkspaceFilesPage = () => {
    const { searchTerm, setSearchTerm } = useRouterSearch()
    const { getEntity, clearSelection } = useSelectionStore(useShallow((state) => ({
        getEntity: state.getEntity,
        clearSelection: state.clearSelection,
    })))
    const filesPageContentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const currentEntity = getEntity()
            
            if (!currentEntity || !filesPageContentRef.current) return

            const isInsideFilesPage = filesPageContentRef.current.contains(target)
            
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
                    <ListPageHeader title='Files'>
                        <div>
                            <CreateFolderButton parentId={ null }>
                                <Button>
                                    Create folder
                                </Button>
                            </CreateFolderButton>
                        </div>
                    </ListPageHeader>
                    <ScrollArea verticalMargin={ 24 }>
                        <div
                            className='p-7'
                            ref={ filesPageContentRef }
                        >
                            <FolderList />
                            <div className='mt-10'>
                            </div>
                            <FileList />
                        </div>
                    </ScrollArea>
                </LayoutBodyContainer>
            </div>
        </FilesDndContext>
    )
}
