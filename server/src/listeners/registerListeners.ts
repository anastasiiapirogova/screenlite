import { registerDeviceConnectedListener } from './deviceConnected.js'
import { registerDeviceDisconnectedListener } from './deviceDisconnected.js'
import { registerPlaylistLayoutUpdatedListener } from './playlistLayoutUpdated.js'

export const registerListeners = () => {
    registerDeviceConnectedListener()
    registerDeviceDisconnectedListener()
    registerPlaylistLayoutUpdatedListener()
}