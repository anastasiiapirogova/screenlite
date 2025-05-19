import { Screen } from '../types'

const status = {
    online: 'online',
    offline: 'offline',
    notConnected: 'notConnected'
}

export const useScreenStatus = (screen: Screen) => {
    const title = screen.device ? (
        screen.device.isOnline ? 'Online' : 'Offline'
    ) : 'Not connected'

    return {
        title,
        status: screen.device ? (screen.device.isOnline ? status.online : status.offline) : status.notConnected
    }
}