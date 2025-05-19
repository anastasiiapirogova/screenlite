import { addSendNewStateToDeviceJob } from '@modules/device/utils/addSendNewStateToDeviceJob.js'
import { deviceEventEmitter } from '../events/eventEmitter.js'
import { setDeviceOnlineStatus } from '../modules/device/utils/setDeviceOnlineStatus.js'

const handle = async (token: string) => {
    setDeviceOnlineStatus(token, true)

    addSendNewStateToDeviceJob(token)
}

export const registerDeviceConnectedListener = () => {
    deviceEventEmitter.on('deviceConnected', handle)
}
