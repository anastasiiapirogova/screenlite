import { Suspense } from 'react'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router'
import { WorkspacePicture } from '@shared/components/WorkspacePicture'
import { TbPlus } from 'react-icons/tb'
import { Button } from '@shared/ui/buttons/Button'
import { userWorkspacesQuery } from '@modules/workspace/api/requests/userWorkspacesRequest'

const WorkspacesListLoadingState = () => {
    return (
        <div className='grow flex flex-col'>
            <div className='flex flex-col grow items-center justify-center'>
                <div>Loading...</div>
            </div>
        </div>
    )
}

const WorkspacesList = () => {
    const user = useCurrentUser()

    const { data } = useSuspenseQuery(userWorkspacesQuery(user.id, 1, 10))
	
    const { items: memberships } = data
	
    return (
        <div className='max-w-screen-md mx-auto'>
            <div className='flex items-center justify-between mb-4'>
                <div className='text-3xl'>
                    Your workspaces
                </div>
                <Button
                    to={ '/workspaces/create' }
                    icon={ TbPlus }
                >
                    <div className=''>
                        New workspace
                    </div>
                </Button>
            </div>
            <div className='flex flex-col gap-2'>
                {
                    memberships.map(membership => (
                        <Link
                            to={ `/workspaces/${membership.workspace.slug}` }
                            key={ membership.workspace.id }
                            className='flex gap-4 items-center p-5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'
                        >
                            <WorkspacePicture
                                name={ membership.workspace.name }
                                picture={ membership.workspace.picturePath }
                                size={ 48 }
                            />
                            <div className=''>
                                { membership.workspace.name }
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export const UserWorkspacesPage = () => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div>
                    There was an error!
                </div>
            ) }
            >
                <Suspense fallback={ <WorkspacesListLoadingState /> }>
                    <WorkspacesList />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}