import { UserSession } from '../types'
import { useAuthData } from '@modules/auth/hooks/useAuthData'
import { TerminateSessionButton } from './buttons/TerminateSessionButton'
import { TerminateAllSessionsButton } from './buttons/TerminateAllSessionsButton'

const CurrentSessionCardBody = ({ session }: { session: UserSession }) => {
    return (
        <div>
            <p><strong>IP Address:</strong> { session.ipAddress }</p>
            <p><strong>User Agent:</strong> { session.userAgent }</p>
        </div>
    )
}

const SessionCardBody = ({ session }: { session: UserSession }) => {
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
    const { sessionId } = useAuthData()
    const isCurrentSession = session.id === sessionId

    return (
        <div className='mb-2 p-7 bg-slate-100 rounded-xl'>
            {
                isCurrentSession ? (
                    <CurrentSessionCardBody session={ session } />
                ) : (
                    <SessionCardBody session={ session } />
                )
            }
            <div className='flex justify-end items-center'>
                {
                    !isCurrentSession && !session.terminatedAt && (
                        <TerminateSessionButton session={ session } />
                    )
                }
                {
                    isCurrentSession && (
                        <TerminateAllSessionsButton session={ session } />
                    )
                }
            </div>
        </div>
    )
}
