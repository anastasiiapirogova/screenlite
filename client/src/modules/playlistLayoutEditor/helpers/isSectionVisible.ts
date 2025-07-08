import { PlaylistLayoutEditorLayoutSection } from '../types'

type Area = {
    x1: number
    y1: number
    x2: number
    y2: number
}

export const isSectionVisible = (targetId: string, sections: PlaylistLayoutEditorLayoutSection[]): boolean => {
    const target = sections.find(r => r.id === targetId)

    if (!target) return false

    const targetArea = createArea(target)
    const obscuringSections = sections
        .filter(r => r.zIndex > target.zIndex)
        .sort((a, b) => b.zIndex - a.zIndex)

    let uncoveredAreas: Area[] = [targetArea]

    for (const rect of obscuringSections) {
        const obscuringArea = createArea(rect)

        uncoveredAreas = uncoveredAreas.flatMap(area => 
            subtractArea(area, obscuringArea)
        )

        if (uncoveredAreas.length === 0) return false
    }

    return uncoveredAreas.length > 0
}

const createArea = (section: PlaylistLayoutEditorLayoutSection): Area => {
    return {
        x1: section.left,
        y1: section.top,
        x2: section.left + section.width,
        y2: section.top + section.height
    }
}

const areasIntersect = (a: Area, b: Area): boolean => {
    return !(b.x1 >= a.x2 || 
                b.x2 <= a.x1 || 
                b.y1 >= a.y2 || 
                b.y2 <= a.y1)
}

const subtractArea = (original: Area, subtract: Area): Area[] => {
    if (!areasIntersect(original, subtract)) {
        return [original]
    }

    const result: Area[] = []

    const intersection = {
        x1: Math.max(original.x1, subtract.x1),
        y1: Math.max(original.y1, subtract.y1),
        x2: Math.min(original.x2, subtract.x2),
        y2: Math.min(original.y2, subtract.y2)
    }

    if (original.x1 < intersection.x1) {
        result.push({
            x1: original.x1,
            y1: original.y1,
            x2: intersection.x1,
            y2: original.y2
        })
    }

    if (original.x2 > intersection.x2) {
        result.push({
            x1: intersection.x2,
            y1: original.y1,
            x2: original.x2,
            y2: original.y2
        })
    }

    if (original.y1 < intersection.y1) {
        result.push({
            x1: Math.max(original.x1, intersection.x1),
            y1: original.y1,
            x2: Math.min(original.x2, intersection.x2),
            y2: intersection.y1
        })
    }

    if (original.y2 > intersection.y2) {
        result.push({
            x1: Math.max(original.x1, intersection.x1),
            y1: intersection.y2,
            x2: Math.min(original.x2, intersection.x2),
            y2: original.y2
        })
    }

    return result
}