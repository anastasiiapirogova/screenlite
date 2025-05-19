import { Suspense } from 'react'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router'
import { WorkspacePicture } from '../../../shared/components/WorkspacePicture'
import { userInvitationsQuery } from '../api/queries/userInvitationsQuery'
import { TbChevronLeft } from 'react-icons/tb'

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
    
    const { data: invitations } = useSuspenseQuery(userInvitationsQuery(user.id))
        
    return (
        <div className='w-full max-w-[400px] flex flex-col gap-4'>
            <div className='bg-white p-2 border rounded-md flex flex-col gap-2'>
                <Link
                    to={ '/' }
                    className='flex gap-3 items-center p-2 hover:bg-neutral-100 rounded-md cursor-default'
                >
                    <TbChevronLeft className='w-5 h-5'/>
                    <div className=''>
                        Back to workspaces
                    </div>
                </Link>
                { 
                    invitations.length > 0 && (
                        <hr />
                    )
                }
                {
                    invitations.map(workspace => (
                        <div className='flex gap-4 items-center p-2 cursor-default'>
                            <WorkspacePicture
                                name={ workspace.workspace.name }
                                picture={ workspace.workspace.picture }
                                size={ 40 }
                            />
                            <div className=''>
                                { workspace.workspace.name }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export const UserInvitationsPage = () => {
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