import axios from '@/config/axios'
import { DisconnectDeviceRequestData } from '../../types'

type ConnectDeviceRequestResponse = void

export const disconnectDeviceRequest = async (data: DisconnectDeviceRequestData) => {
    await axios.post<ConnectDeviceRequestResponse>('/screens/disconnectDevice', data)
}