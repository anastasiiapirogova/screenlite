import { Suspense } from 'react'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { ErrorBoundary } from 'react-error-boundary'
import { WorkspacePicture } from '../../../shared/components/WorkspacePicture'
import { userInvitationsQuery } from '../api/queries/userInvitationsQuery'

const InvitationsListLoadingState = () => {
    return (
        <div className='grow flex flex-col'>
            <div className='flex flex-col grow items-center justify-center'>
                <div>Loading...</div>
            </div>
        </div>
    )
}

const InvitationsList = () => {
    const user = useCurrentUser()
    
    const { data: invitations } = useSuspenseQuery(userInvitationsQuery(user.id))
        
    return (
        <div className='w-full max-w-[400px] flex flex-col gap-4'>
            <div className='bg-white p-2 border rounded-md flex flex-col gap-2'>
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
                <Suspense fallback={ <InvitationsListLoadingState /> }>
                    <InvitationsList />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}