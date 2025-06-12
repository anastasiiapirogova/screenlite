import axios from '@/config/axios'
import { ConnectDeviceRequestData, Device } from '../../types'

type ConnectDeviceRequestResponse = {
	device: Device
}

export const connectDeviceRequest = async (data: ConnectDeviceRequestData) => {
    const response = await axios.post<ConnectDeviceRequestResponse>(`/workspaces/${data.workspaceId}/screens/${data.screenId}/connectDevice`, data)

    return response.data.device
}