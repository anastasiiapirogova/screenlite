import { deviceEventEmitter } from '../events/eventEmitter.js'
import { setDeviceOnlineStatus } from '../modules/device/utils/setDeviceOnlineStatus.js'

const handle = async (token: string) => {
    setDeviceOnlineStatus(token, false)
}

export const registerDeviceDisconnectedListener = () => {
    deviceEventEmitter.on('deviceDisconnected', handle)
}
