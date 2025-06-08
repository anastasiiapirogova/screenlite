import { ListPageHeader } from '@shared/components/ListPageHeader'
import { useRouterSearch } from '@/shared/hooks/useRouterSearch'
import { Input } from '@shared/ui/input/Input'
import { CreateFolderButton } from '../components/buttons/CreateFolderButton'
import { Button } from '@shared/ui/buttons/Button'
import { Folders } from '../components/Folders'
import { FileList } from '../components/FileList'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspaceFilesPage = () => {
    const { searchTerm, setSearchTerm } = useRouterSearch()

    return (
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
                    <div className='p-7'>
                        <Folders />
                        <FileList />
                    </div>
                </ScrollArea>
            </LayoutBodyContainer>
        </div>
    )
}
