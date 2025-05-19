import { ScreenType } from '../types'

export type ScreenTypeOption = {
	value: ScreenType
	label: string
}

export const screenTypes: ScreenTypeOption[] = [
    {
        value: 'consumer_tv',
        label: 'Consumer TV'
    },
    {
        value: 'commercial_display',
        label: 'Commercial Display'
    },
    {
        value: 'touchscreen_display',
        label: 'Touchscreen Display'
    },
    {
        value: 'video_wall',
        label: 'Video Wall'
    },
    {
        value: 'led_screen',
        label: 'LED Screen'
    },
    {
        value: 'kiosk',
        label: 'Kiosk'
    },
    {
        value: 'projector',
        label: 'Projector'
    },
    {
        value: 'tablet',
        label: 'Tablet'
    },
    {
        value: 'smartphone',
        label: 'Smartphone'
    },
    {
        value: 'digital_frame',
        label: 'Digital Frame'
    },
    {
        value: 'other',
        label: 'Other'
    }
]

export const getScreenTypeLabel = (type: ScreenType) => {
    const screenType = screenTypes.find((screenType) => screenType.value === type)

    return screenType ? screenType.label : 'Unknown'
}