import axios from '@/config/axios'
import { ConnectDeviceRequestData, Device } from '../../types'

type ConnectDeviceRequestResponse = {
	device: Device
}

export const connectDeviceRequest = async (data: ConnectDeviceRequestData) => {
    const response = await axios.post<ConnectDeviceRequestResponse>('/screens/connectDevice', data)

    return response.data.device
}