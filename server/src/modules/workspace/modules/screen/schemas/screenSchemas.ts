import { CONNECTION_CODE_CHARACTERS } from '@modules/device/repositories/DeviceRepository.js'
import { paginationSchema } from 'schemas/paginationSchema.js'
import { z } from 'zod'

export const screenTypes = [
    'consumer_tv',
    'commercial_display',
    'touchscreen_display',
    'video_wall',
    'led_screen',
    'kiosk',
    'projector',
    'tablet',
    'smartphone',
    'digital_frame',
    'other'
] as const

const nameSchema = z
    .string({
        invalid_type_error: 'SCREEN_NAME_IS_INVALID',
    })
    .nonempty('SCREEN_NAME_IS_REQUIRED')

const screenId = z.string().uuid()

export const createScreenSchema = z.object({
    name: nameSchema,
    type: z.enum(screenTypes),
})

export const connectDeviceSchema = z.object({
    screenId,
    connectionCode: z.string().regex(
        new RegExp(`^[${CONNECTION_CODE_CHARACTERS}]+$`, 'i'),
        'CONNECTION_CODE_IS_INVALID'
    )
})

export const disconnectDeviceSchema = z.object({
    screenId,
})

export const deleteScreensSchema = z.object({
    screenIds: z.array(screenId),
})

export const workspaceScreensSchema = paginationSchema.extend({
    playlistId: z.string().optional(),
    search: z.string().optional(),
    status: z.array(z.enum(['online', 'offline', 'connected', 'not_connected'])).optional(),
    type: z.array(z.enum(screenTypes)).optional(),
})