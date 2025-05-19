export type ScreenType =
	| 'consumer_tv'
	| 'commercial_display'
	| 'touchscreen_display'
	| 'video_wall'
	| 'led_screen'
	| 'kiosk'
	| 'projector'
	| 'tablet'
	| 'smartphone'
	| 'digital_frame'
	| 'other';

export type ScreenStatus = 'online' | 'offline' | 'connected' | 'not_connected';

export type Screen = {
	id: string
	workspaceId: string
	name: string
	resolutionWidth: number
	resolutionHeight: number
	type: ScreenType
	createdAt: string
	updatedAt: string
	device?: Device
	layoutResolution: {
		width: number
		height: number
	}
	_count: {
		playlists: number
	}
}

export type CreateScreenRequestData = {
	workspaceId: string
	name: string
	type: ScreenType
}

export type ConnectDeviceRequestData = {
	screenId: string
	connectionCode: string
}

export type DisconnectDeviceRequestData = {
	screenId: string
}

export type DeleteScreensRequestData = {
	screenIds: string[]
}

export type Device = {
	id: string
	screenId?: string
	connectionCode: string
	createdAt: string
	updatedAt: string
	telemetry: Telemetry
	status: DeviceStatusLog
	isOnline: boolean
}

export type Telemetry = {
	id: string
	deviceId: string
	localIpAddress: string
	publicIpAddress: string
	macAddress: string
	softwareVersion: string
	platform: string
	osRelease: string
	screenResolutionWidth: number
	screenResolutionHeight: number
	hostname: string
	timezone: string
	totalMemory: string
	freeMemory: string
	createdAt: string
}

export type DeviceStatusLog = {
	id: string
	deviceId: string
	isOnline: boolean
	createdAt: string
}