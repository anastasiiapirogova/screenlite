import { z } from 'zod'

const Weekday = z.enum([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
])

export const deleteScheduleSchema = z.object({
    scheduleId: z.string().nonempty('SCHEDULE_ID_IS_REQUIRED'),
})

const timeValidation = z.string().refine((val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
    message: 'INVALID_START_TIME',
}).refine((val) => val >= '00:00' && val <= '23:59', {
    message: 'START_TIME_OUT_OF_RANGE',
})

const baseScheduleSchema = z.object({
    startAt: z.string().datetime({ message: 'INVALID_START_AT' }),
    endAt: z.string().datetime({ message: 'INVALID_END_AT' }).nullable(),
    startTime: timeValidation.nullable(),
    endTime: timeValidation.nullable(),
    weekdays: z.array(Weekday, { message: 'INVALID_WEEKDAYS_ARRAY' }),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateEndAfterStart = (schema: any) => {
    const { startAt, endAt } = schema

    if (!startAt || !endAt) {
        return true
    }
    return new Date(endAt) >= new Date(startAt)
}

export const updateScheduleValidationSchema = baseScheduleSchema.extend({
    scheduleId: z.string().nonempty('SCHEDULE_ID_IS_REQUIRED'),
}).refine(validateEndAfterStart, {
    message: 'END_AT_BEFORE_START_AT',
    path: ['endAt'],
})

export const createScheduleValidationSchema = baseScheduleSchema.extend({
    playlistId: z.string().nonempty('PLAYLIST_ID_IS_REQUIRED'),
}).refine(validateEndAfterStart, {
    message: 'END_AT_BEFORE_START_AT',
    path: ['endAt'],
})
