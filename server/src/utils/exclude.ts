export function exclude<Obj extends Record<string, unknown>, Key extends keyof Obj>(
    obj: Obj,
    keys: Key[]
): Omit<Obj, Key> {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keys.includes(key as Key))
    ) as Omit<Obj, Key>
}

export function excludeFromArray<Obj extends Record<string, unknown>, Key extends keyof Obj>(
    arr: Obj[],
    keys: Key[]
): Omit<Obj, Key>[] {
    return arr.map(obj => exclude(obj, keys))
}