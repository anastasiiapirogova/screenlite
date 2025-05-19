import { Weekday } from '@prisma/client'

export type CreateScheduleData = {
    startAt: string
    endAt: string | null
    startTime: string | null
    endTime: string | null
    weekdays: Weekday[]
}