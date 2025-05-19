import { Suspense } from 'react'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { userWorkspacesQuery } from '../api/queries/userWorkspacesQuery'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router'
import { WorkspacePicture } from '../../../shared/components/WorkspacePicture'
import { TbMailSpark, TbPlus } from 'react-icons/tb'

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
        <div className='w-full max-w-[400px] flex flex-col gap-4'>
            <div className='bg-white p-2 border rounded-md flex flex-col gap-2'>
                {
                    workspaces.map(workspace => (
                        <Link
                            to={ `/workspaces/${workspace.slug}` }
                            key={ workspace.id }
                            className='flex gap-4 items-center p-2 hover:bg-gray-100 rounded-md cursor-default'
                        >
                            <WorkspacePicture
                                name={ workspace.name }
                                picture={ workspace.picture }
                                size={ 40 }
                            />
                            <div className=''>
                                { workspace.name }
                            </div>
                        </Link>
                    ))
                }
                { 
                    workspaces.length > 0 && (
                        <hr />
                    )
                }
                <Link
                    to={ '/invitations' }
                    className='flex gap-3 items-center p-2 hover:bg-gray-100 rounded-md cursor-default'
                >
                    <TbMailSpark className='w-5 h-5'/>
                    <div className=''>
                        Invitations
                    </div>
                </Link>
                <Link
                    to={ '/workspaces/create' }
                    className='flex gap-3 items-center p-2 hover:bg-gray-100 rounded-md cursor-default'
                >
                    <TbPlus className='w-5 h-5'/>
                    <div className=''>
                        Create workspace
                    </div>
                </Link>
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