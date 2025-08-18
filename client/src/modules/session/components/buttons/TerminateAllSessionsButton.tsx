import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserSession } from '@modules/session/types'
import { terminateAllSessionsRequest, TerminateAllSessionsRequestData } from '../../api/requests/terminateAllSessionsRequest'
import { Button } from '@shared/ui/buttons/Button'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'

export const TerminateAllSessionsButton = ({ session }: { session: UserSession }) => {
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