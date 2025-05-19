export const getEffectivePermissions = (directPermissions: string[], hierarchy: Record<string, string[]>): Set<string> => {
    const effective = new Set(directPermissions)

    const stack = [...directPermissions]

    while (stack.length > 0) {
        const current = stack.pop()
        const implied = hierarchy[current!]

        if (implied) {
            for (const perm of implied) {
                if (!effective.has(perm)) {
                    effective.add(perm)
                    stack.push(perm)
                }
            }
        }
    }

    return effective
}