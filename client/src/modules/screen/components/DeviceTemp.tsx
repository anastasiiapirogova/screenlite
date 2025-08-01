import { Device } from '../types'
import { DisconnectDeviceButton } from './DisconnectDeviceButton'

export const DeviceTemp = ({ device }: { device: Device }) => {
    const status = device.status
    const telemetry = device.telemetry

    const isOnline = status?.isOnline

    return (
        <>
            <div className='mt-10 flex items-center gap-5'>
                <div className='text-xl font-medium'>
                    Device
                </div>
                <DisconnectDeviceButton buttonText="Disconnect device" />
            </div>
            <div>
                Connection code
                <div>
                    {
                        device.connectionCode
                    }
                </div>
            </div>
            <div className='flex gap-5'>
                <div>
                    <div>Status</div>
                    <div>
                        { isOnline ? 'Online' : 'Offline' }
                    </div>
                </div>
                <div>
                    <div>{ isOnline ? 'Connected at' : 'Disconnected at' }</div>
                    <div>
                        { status?.createdAt }
                    </div>
                </div>
                <div>
                    Software
                    <div>
                        { telemetry?.softwareVersion } { telemetry?.platform }
                    </div>
                </div>
                <div>
                    Date time
                    <div>
                        { telemetry?.timezone }
                    </div>
                </div>
                <div>
                    <div>Network info</div>
                    <div>
                        { telemetry?.localIpAddress }
                    </div>
                    <div>
                        { telemetry?.publicIpAddress }
                    </div>
                    <div>
                        { telemetry?.hostname }
                    </div>
                    <div>
                        { telemetry?.macAddress }
                    </div>
                </div>
            </div>
        </>
    )
}