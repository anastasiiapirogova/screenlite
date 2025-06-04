import { useQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { FullWidthSettingsPageHeader } from '@modules/user/components/FullWidthSettingsPageHeader'
import { userSessionsQuery } from '../queries/userSessionsQuery'

export const CurrentUserSessionsPage = () => {
    const user = useCurrentUser()

    const { data: sessions, isLoading, error } = useQuery(userSessionsQuery({
        userId: user.id,
        filters: {
            page: 1,
            limit: 10,
            status: 'active'
        }
    }))

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading sessions</div>

    return (
        <div>
            <FullWidthSettingsPageHeader backLink='/security'>
                Sessions
            </FullWidthSettingsPageHeader>
            <div className='max-w-screen-sm mx-auto p-5'>
                <ul>
                    { sessions?.data!.map((session) => (
                        <li key={ session.id }>
                            <p><strong>IP Address:</strong> { session.ipAddress }</p>
                            <p><strong>User Agent:</strong> { session.userAgent }</p>
                            <p><strong>Last activity at:</strong> { session.lastActivityAt }</p>
                        </li>
                    )) }
                </ul>
            </div>
        </div>
    )
}
