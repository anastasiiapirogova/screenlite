import { SettingsCard } from './SettingsCard'
import { useQuery } from '@tanstack/react-query'
import { userActiveSessionsQuery } from '../api/queries/userActiveSessionsQuery'
import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { UserSession } from '../types'
import { Button } from '@shared/ui/buttons/Button'

const SESSION_ITEM_HEIGHT = 'h-24'
const SESSION_LIST_HEIGHT = 'min-h-24'

const SessionCard = ({ session }: { session: UserSession }) => {
    return (
        <li className={ `mb-2 ${SESSION_ITEM_HEIGHT} flex flex-col justify-center border-b last:border-b-0` }>
            <p><strong>IP Address:</strong> { session.ipAddress }</p>
            <p><strong>User Agent:</strong> { session.userAgent }</p>
            <p><strong>Last activity at:</strong> { new Date(session.lastActivityAt).toLocaleString() }</p>
        </li>
    )
}

export const SessionsSecurityCard = () => {
    const user = useCurrentUser()
    const { data: sessions, isLoading } = useQuery(userActiveSessionsQuery(user.id))

    const latestSessions = sessions
        ? [...sessions]
            .sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime())
            .slice(0, 3)
        : []

    return (
        <SettingsCard
            title='Sessions'
            description='If you notice any suspicious activity, you can terminate the session.'
        >
            <div className='m-5'>
                <div>
                    Latest active sessions
                </div>
                <div className={ SESSION_LIST_HEIGHT }>
                    { isLoading ? (
                        <ul className='list-disc pl-5'>
                            { [1].map((i) => (
                                <li
                                    key={ i }
                                    className={ `${SESSION_ITEM_HEIGHT} mb-2 flex flex-col justify-center animate-pulse bg-gray-100 rounded` }
                                ></li>
                            )) }
                        </ul>
                    ) : latestSessions.length > 0 ? (
                        <ul className='list-disc pl-5'>
                            { latestSessions.map((session) => (
                                <SessionCard
                                    key={ session.id }
                                    session={ session }
                                />
                            )) }
                        </ul>
                    ) : (
                        <div className={ `flex items-center justify-center ${SESSION_ITEM_HEIGHT}` }>
                            <p className='text-gray-500'>No active sessions found.</p>
                        </div>
                    ) }
                </div>
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
