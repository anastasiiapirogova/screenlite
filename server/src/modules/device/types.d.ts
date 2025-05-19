export type DeviceData = {
	localIpAddress: string
	macAddress: string
	softwareVersion: string
	screenResolutionWidth: number
	screenResolutionHeight: number
	platform: string
	hostname: string
	timezone: string
	totalMemory: number
	freeMemory: number
	osRelease: string
}

export type InitDeviceInfo = {
	token: string
	localIpAddress: string
	macAddress: string
	softwareVersion: string
	screenResolutionWidth: number
	screenResolutionHeight: number
	platform: string
}