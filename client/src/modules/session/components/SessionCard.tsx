import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@shared/ui/buttons/Button'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'
import { terminateSessionRequest, TerminateSessionRequestData } from '../api/requests/terminateSessionRequest'
import { UserSession } from '../types'
import { terminateAllSessionsRequest, TerminateAllSessionsRequestData } from '../api/requests/terminateAllSessionsRequest'

const TerminateAllSessionsButton = ({ session }: { session: UserSession }) => {
    const queryClient = useQueryClient()

    const invalidateUserSessions = () => {
        queryClient.invalidateQueries({
            queryKey: ['userSessions', { userId: session.userId }],
        })
    }

    const { mutate: terminateAllMutation, isPending } = useMutation({
        mutationFn: (data: TerminateAllSessionsRequestData) => terminateAllSessionsRequest(data),
        onSuccess: async () => {
            invalidateUserSessions()
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const terminateAll = () => {
        terminateAllMutation({ userId: session.userId, excludeSessionId: session.id })
    }

    return (
        <Button
            onClick={ terminateAll }
            color='secondary'
            disabled={ isPending }
            size='small'
            icon={ isPending ? ButtonSpinner : undefined }
        >
            Terminate all other sessions
        </Button>
    )
}

const TerminateSessionButton = ({ session }: { session: UserSession }) => {
    const queryClient = useQueryClient()

    const invalidateUserSessions = () => {
        queryClient.invalidateQueries({
            queryKey: ['userSessions', { userId: session.userId }],
        })
    }

    const { mutate: terminateMutation, isPending } = useMutation({
        mutationFn: (data: TerminateSessionRequestData) => terminateSessionRequest(data),
        onSuccess: async () => {
            invalidateUserSessions()
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const terminate = () => {
        terminateMutation({ sessionId: session.id })
    }

    return (
        <Button
            onClick={ terminate }
            color='secondary'
            disabled={ isPending }
            size='small'
            icon={ isPending ? ButtonSpinner : undefined }
        >
            Terminate
        </Button>
    )
}

const CurrentSessionCardBody = ({ session }: { session: UserSession }) => {
    return (
        <div>
            <p><strong>IP Address:</strong> { session.ipAddress }</p>
            <p><strong>User Agent:</strong> { session.userAgent }</p>
        </div>
    )
}

const OtherSessionCardBody = ({ session }: { session: UserSession }) => {
    return (
        <div>
            <p><strong>IP Address:</strong> { session.ipAddress }</p>
            <p><strong>User Agent:</strong> { session.userAgent }</p>
            <p><strong>Last activity at:</strong> { session.lastActivityAt }</p>
            <p>Terminated at: { session.terminatedAt }</p>
        </div>
    )
}

export const SessionCard = ({ session }: { session: UserSession }) => {
    return (
        <div className='mb-2 p-7 bg-slate-100 rounded-xl'>
            {
                session.token ? (
                    <CurrentSessionCardBody session={ session } />
                ) : (
                    <OtherSessionCardBody session={ session } />
                )
            }
            <div className='flex justify-end items-center'>
                { !session.token && !session.terminatedAt && (
                    <TerminateSessionButton session={ session } />
                ) }
                { session.token && (
                    <TerminateAllSessionsButton session={ session } />
                ) }
            </div>
        </div>
    )
}
