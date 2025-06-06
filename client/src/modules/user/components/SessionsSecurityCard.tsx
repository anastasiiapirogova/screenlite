import { SettingsCard } from '../../../shared/components/SettingsCard'
import { useQuery } from '@tanstack/react-query'
import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { userSessionsQuery } from '@modules/session/queries/userSessionsQuery'
import { Button } from '@shared/ui/buttons/Button'

export const SessionsSecurityCard = () => {
    const user = useCurrentUser()
    const { data } = useQuery(userSessionsQuery({
        userId: user.id,
        filters: {
            page: 1,
            limit: 1,
            status: 'active'
        }
    }))

    const count = data?.meta?.total || 0

    return (
        <SettingsCard
            title='Sessions'
            description='If you notice any suspicious activity, you can terminate the session.'
        >
            <div className='m-5'>
                <p className='mb-2'>
                    You have { count } active session{ count !== 1 ? 's' : '' }.
                </p>
                <div className='flex justify-end'>
                    <Button
                        to="/security/sessions"
                        color='secondary'
                        variant="soft"
                    >
                        Manage sessions
                    </Button>
                </div>
            </div>
        </SettingsCard>
    )
}
