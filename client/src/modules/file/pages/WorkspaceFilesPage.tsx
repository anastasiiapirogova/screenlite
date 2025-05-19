import { ListPageHeader } from '@shared/components/ListPageHeader'
import { useRouterSearch } from '@/shared/hooks/useRouterSearch'
import { Input } from '@shared/ui/input/Input'
import { InnerSidebarLayout } from '@shared/layouts/InnerSidebarLayout'
import { CreateFolderButton } from '../components/buttons/CreateFolderButton'
import { Button } from '@shared/ui/buttons/Button'
import { FolderList } from '../components/FolderList'
import { FileList } from '../components/FileList'

export const WorkspaceFilesPage = () => {
    const { searchTerm, setSearchTerm } = useRouterSearch()

    return (
        <div className='flex flex-col grow max-w-(--breakpoint-xl) mx-auto w-full px-10 gap-5'>
            <ListPageHeader title='Files'>
                <div>
                    <CreateFolderButton parentId={ null }>
                        <Button>
                            Create folder
                        </Button>
                    </CreateFolderButton>
                </div>
            </ListPageHeader>
            <InnerSidebarLayout sidebar={ <div className='flex gap-4 items-center'>
                <Input
                    value={ searchTerm }
                    onChange={ (e) => setSearchTerm(e.target.value) }
                    placeholder="Search..."
                />
            </div> }
            >
                <>
                    <FolderList />
                    <FileList />
                </>
            </InnerSidebarLayout>
        </div>
    )
}
