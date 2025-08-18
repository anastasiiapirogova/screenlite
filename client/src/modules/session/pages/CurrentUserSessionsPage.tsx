import { useQuery } from '@tanstack/react-query'
import { FullWidthSettingsPageHeader } from '@modules/user/components/FullWidthSettingsPageHeader'
import { userSessionsQuery } from '../queries/userSessionsQuery'
import { useRouterSessionFilter } from '../hooks/useRouterSessionFilter'
import { SessionCard } from '../components/SessionCard'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { useAuthData } from '@modules/auth/hooks/useAuthData'

export const CurrentUserSessionsPage = () => {
    const { user, sessionId } = useAuthData()
    const { filters } = useRouterSessionFilter()

    const { data: sessions, isLoading, error } = useQuery(userSessionsQuery({
        userId: user.id,
        filters
    }))

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading sessions</div>

    const currentSession = sessions?.items.find(session => session.id === sessionId)
    const otherSessions = sessions?.items.filter(session => session.id !== sessionId)

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
                        { otherSessions?.length !== 0 && (
                            <>
                                <h2 className='text-xl mb-2'>Other sessions</h2>
                                { otherSessions?.map((session) => (
                                    <SessionCard
                                        key={ session.id }
                                        session={ session }
                                    />
                                )) }
                            </>
                        ) }
                    </div>
                </div>
            </ScrollArea>
        </>
    )
}
