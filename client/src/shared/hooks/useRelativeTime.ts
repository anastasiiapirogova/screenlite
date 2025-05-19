import { dayjs } from '@config/dayjs'
import { useState, useEffect } from 'react'

export const useRelativeTime = (timestamp: string) => {
    const [relativeTimeString, setRelativeTimeString] = useState(dayjs(timestamp).fromNow())

    useEffect(() => {
        setRelativeTimeString(dayjs(timestamp).fromNow())

        const interval = setInterval(() => {
            setRelativeTimeString(dayjs(timestamp).fromNow())
        }, 60000)

        return () => clearInterval(interval)
    }, [timestamp])

    return relativeTimeString
}