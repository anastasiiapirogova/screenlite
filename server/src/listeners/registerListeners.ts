import { registerDeviceConnectedListener } from './deviceConnected.js'
import { registerDeviceDisconnectedListener } from './deviceDisconnected.js'
import { registerPlaylistLayoutUpdatedListener } from './playlistLayoutUpdated.js'
import { registerUserSignedUpListener } from './userSignedUp.js'

export const registerListeners = () => {
    registerUserSignedUpListener()
    registerDeviceConnectedListener()
    registerDeviceDisconnectedListener()
    registerPlaylistLayoutUpdatedListener()
}