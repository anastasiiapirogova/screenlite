import { registerDeviceConnectedListener } from './deviceConnected.js'
import { registerDeviceDisconnectedListener } from './deviceDisconnected.js'

export const registerListeners = () => {
    registerDeviceConnectedListener()
    registerDeviceDisconnectedListener()
}