import { ListPageHeader } from '@shared/components/ListPageHeader'
import { useSearchCountStore } from '@stores/useSearchCountStore'

export const WorkspaceMembersPageHeader = () => {
    const { memberCount } = useSearchCountStore()

    return (
        <ListPageHeader
            title='Members'
            count={ memberCount }
        >
        </ListPageHeader>
    )
}