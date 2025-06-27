import { Weekday } from '@/generated/prisma/client.ts'

export type CreateScheduleData = {
    startAt: string
    endAt: string | null
    startTime: string | null
    endTime: string | null
    weekdays: Weekday[]
}