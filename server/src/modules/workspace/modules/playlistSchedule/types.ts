import { Weekday } from '@/generated/prisma/client.js'

export type CreateScheduleData = {
    startAt: string
    endAt: string | null
    startTime: string | null
    endTime: string | null
    weekdays: Weekday[]
}