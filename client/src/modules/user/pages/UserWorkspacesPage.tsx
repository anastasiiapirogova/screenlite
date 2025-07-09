import { Suspense } from 'react'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { userWorkspacesQuery } from '../../workspace/api/queries/userWorkspacesQuery'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router'
import { WorkspacePicture } from '@shared/components/WorkspacePicture'
import { TbPlus } from 'react-icons/tb'
import { Button } from '@shared/ui/buttons/Button'

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
	
    const { workspaces } = data
	
    return (
        <div className=''>
            <div className='flex items-center justify-between mb-4'>
                <div className='text-3xl'>
                    Your workspaces
                </div>
                <Button
                    to={ '/workspaces/create' }
                    icon={ TbPlus }
                >
                    <div className=''>
                        Create workspace
                    </div>
                </Button>
            </div>
            <div className='flex flex-col gap-2'>
                {
                    workspaces.map(workspace => (
                        <Link
                            to={ `/workspaces/${workspace.slug}` }
                            key={ workspace.id }
                            className='flex gap-4 items-center p-5 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors'
                        >
                            <WorkspacePicture
                                name={ workspace.name }
                                picture={ workspace.picture }
                                size={ 48 }
                            />
                            <div className=''>
                                { workspace.name }
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