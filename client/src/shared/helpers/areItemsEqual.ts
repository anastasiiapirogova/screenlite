export const areItemsEqual = <T extends { id: string }>(a: T[], b: T[], comparableFields: (keyof T)[]): boolean => {
    if (a.length !== b.length) {
        return false
    }

    const aMap = new Map(a.map(item => [item['id'], item]))
    const bMap = new Map(b.map(item => [item['id'], item]))

    for (const id of aMap.keys()) {
        if (!bMap.has(id)) {
            return false
        }

        const aItem = aMap.get(id)!
        const bItem = bMap.get(id)!

        for (const field of comparableFields) {
            const aValue = aItem[field]
            const bValue = bItem[field]

            if (typeof aValue === 'number' && typeof bValue === 'string' && !isNaN(Number(bValue))) {
                if (aValue !== Number(bValue)) {
                    return false
                }
            } else if (typeof aValue === 'string' && !isNaN(Number(aValue)) && typeof bValue === 'number') {
                if (Number(aValue) !== bValue) {
                    return false
                }
            } else if (aValue !== bValue) {
                return false
            }
        }
    }

    return true
}