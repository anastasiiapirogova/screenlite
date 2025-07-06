const getDeviceConnectionClause = (isConnected?: boolean, isNotConnected?: boolean) => {
    if (isNotConnected && !isConnected) return { is: null }
    if (isConnected && !isNotConnected) return { isNot: null }
    return false
}

const getIsOnlineClause = (isOnline?: boolean, isOffline?: boolean) => {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    
    if (isOnline && !isOffline) return { onlineAt: { gte: twoMinutesAgo } }
    if (isOffline && !isOnline) return { onlineAt: { lt: twoMinutesAgo } }
    return false
}

export const getDeviceStatusClause = (
    status?: ('online' | 'offline' | 'connected' | 'not_connected')[]
) => {
    if (!status || status.length === 0) return {}

    const isOnline = status.includes('online')
    const isOffline = status.includes('offline')
    const isConnected = status.includes('connected')
    const isNotConnected = status.includes('not_connected')

    if (isConnected && isNotConnected) return {}

    const connectionClause = getDeviceConnectionClause(isConnected, isNotConnected)
    const isOnlineClause = getIsOnlineClause(isOnline, isOffline)

    const clauses = [
        isOnlineClause && { device: isOnlineClause },
        connectionClause && { device: connectionClause },
    ].filter((clause) => clause !== false && clause !== true)

    return clauses.length > 0 ? { OR: clauses } : {}
}