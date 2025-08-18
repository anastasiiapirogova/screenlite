import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@shared/ui/buttons/Button'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'
import { UserSession } from '@modules/session/types'
import { terminateSessionRequest, TerminateSessionRequestData } from '../../api/requests/terminateSessionRequest'

export const TerminateSessionButton = ({ session }: { session: UserSession }) => {
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