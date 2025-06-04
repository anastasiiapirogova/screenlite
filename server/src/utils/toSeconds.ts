export const toSeconds = (value: number, unit: 'seconds' | 'minutes' | 'hours'): number => {
    switch (unit) {
        case 'seconds': return value
        case 'minutes': return value * 60
        case 'hours': return value * 3600
    }
}