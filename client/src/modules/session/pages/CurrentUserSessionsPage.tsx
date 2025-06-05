import { useQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { FullWidthSettingsPageHeader } from '@modules/user/components/FullWidthSettingsPageHeader'
import { userSessionsQuery } from '../queries/userSessionsQuery'
import { useRouterSessionFilter } from '../hooks/useRouterSessionFilter'
import { SessionCard } from '../components/SessionCard'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const CurrentUserSessionsPage = () => {
    const user = useCurrentUser()
    const { filters } = useRouterSessionFilter()

    const { data: sessions, isLoading, error } = useQuery(userSessionsQuery({
        userId: user.id,
        filters
    }))

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading sessions</div>

    const currentSession = sessions?.data!.find(session => session.token)
    const otherSessions = sessions?.data!.filter(session => !session.token)

    return (
        <>
            <FullWidthSettingsPageHeader backLink='/security'>
                Sessions
            </FullWidthSettingsPageHeader>
            <ScrollArea verticalMargin={ 24 }>
                <div className='max-w-screen-sm mx-auto p-5 flex flex-col gap-5'>
                    <div>
                        <p className='mb-2'>
                            Here you can manage your active sessions. If you notice any suspicious activity, you can terminate the session.
                        </p>
                    </div>
                    <div className='mb-5'>
                        <h2 className='text-xl mb-2'>Current session</h2>
                        { currentSession ? (
                            <SessionCard
                                key={ currentSession.id }
                                session={ currentSession }
                            />
                        ) : (
                            <div>No active session found.</div>
                        ) }
                    </div>
                    <div>
                        <h2 className='text-xl mb-2'>Other sessions</h2>
                        { otherSessions?.map((session) => (
                            <SessionCard
                                key={ session.id }
                                session={ session }
                            />
                        )) }
                    </div>
                </div>
            </ScrollArea>
        </>
    )
}
