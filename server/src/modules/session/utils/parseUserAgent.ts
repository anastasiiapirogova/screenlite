import { UAParser } from 'ua-parser-js'

export const parseUserAgent = (userAgent: string): string => {
    const parser = new UAParser(userAgent)
    const os = parser.getOS()
    const browser = parser.getBrowser()

    const osInfo = os.name ? `${os.name}` : undefined

    const browserInfo = browser.name ? `${browser.name}` : undefined

    const parts = []

    if (osInfo) parts.push(`${osInfo},`)
    if (browserInfo) parts.push(browserInfo)

    if (parts.length === 0) {
        return 'Unknown'
    }

    return parts.join(' ')
}
