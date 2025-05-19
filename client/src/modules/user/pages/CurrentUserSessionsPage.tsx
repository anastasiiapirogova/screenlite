import { useQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { userActiveSessionsQuery } from '../api/queries/userActiveSessionsQuery'
import { ListPageHeader } from '@shared/components/ListPageHeader'

export const CurrentUserSessionsPage = () => {
    const user = useCurrentUser()
	
    const { data: sessions, isLoading, error } = useQuery(userActiveSessionsQuery(user.id))

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading sessions</div>

    return (
        <div>
            <ListPageHeader
                title='Your active sessions'
                count={ sessions!.length }
            />
            <ul>
                { sessions!.map((session) => (
                    <li key={ session.id }>
                        <p><strong>IP Address:</strong> { session.ipAddress }</p>
                        <p><strong>User Agent:</strong> { session.userAgent }</p>
                        <p><strong>Last activity at:</strong> { session.lastActivityAt }</p>
                    </li>
                )) }
            </ul>
        </div>
    )
}
