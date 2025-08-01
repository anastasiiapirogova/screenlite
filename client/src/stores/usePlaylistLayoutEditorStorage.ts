import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { PlaylistLayout } from '@modules/workspace/modules/playlistLayout/types'
import { Resolution } from '@/types'
import { arePlaylistLayoutSectionsEqual } from '@modules/playlistLayoutEditor/helpers/arePlaylistLayoutSectionsModified'
import { v4 as uuidv4 } from 'uuid'
import { isEqual } from 'lodash'
import { PlaylistLayoutEditorLayoutSection } from '@modules/playlistLayoutEditor/types'

export type NewSectionData = Omit<PlaylistLayoutEditorLayoutSection, 'id' | 'playlistLayoutId' | 'zIndex'>

type State = {
    sections: PlaylistLayoutEditorLayoutSection[] | null
    resolution: Resolution | null
    initializedAt: Date | null
    isModified: boolean
    initialLayoutData: PlaylistLayout | null
    pastSections: PlaylistLayoutEditorLayoutSection[][]
    futureSections: PlaylistLayoutEditorLayoutSection[][]
}

type Action = {
    checkLayoutModified: () => void,
    removeSection: (id: string) => void,
    initStorage: (sections: PlaylistLayoutEditorLayoutSection[], resolution: Resolution, initialLayoutData: PlaylistLayout) => void,
    reorderLayoutSections: (sections: PlaylistLayoutEditorLayoutSection[]) => void,
    addSection: (section: NewSectionData) => void,
    updateSection: (section: PlaylistLayoutEditorLayoutSection) => void,
    reset: () => void,
    setInitialLayoutData: (initialLayoutData: PlaylistLayout) => void,
    setSections: (sections: PlaylistLayoutEditorLayoutSection[]) => void,
}

const emptyState = {
    sections: null,
    resolution: null,
    initializedAt: null,
    isModified: false,
    initialLayoutData: null,
    pastSections: [],
    futureSections: [],
}

export const usePlaylistLayoutEditorStorage = create<State & Action & {
    undo: () => void,
    redo: () => void,
    canUndo: boolean,
    canRedo: boolean,
}>()(
    devtools(
        (set, get) => ({
            ...emptyState,

            reset: () => set(emptyState),

            checkLayoutModified: () => {
                const sections = get().sections
                const playlistLayout = get().initialLayoutData

                if (!sections || !playlistLayout) return

                const isModified = !arePlaylistLayoutSectionsEqual(sections, playlistLayout.sections)

                set({ isModified })
            },

            addSection: (section) => {
                set((state) => {
                    const sections = state.sections
                    const playlistLayoutId = state.initialLayoutData?.id

                    if (!sections || !playlistLayoutId) return state

                    const zIndex = sections.length + 1

                    const newSection = {
                        ...section,
                        id: uuidv4(),
                        playlistLayoutId,
                        zIndex,
                    }

                    return {
                        pastSections: [...state.pastSections, sections],
                        futureSections: [],
                        sections: [...sections, newSection],
                    }
                })
                get().checkLayoutModified()
            },

            initStorage: (sections, resolution, initialLayoutData) => {
                set({
                    sections,
                    resolution,
                    initialLayoutData,
                    isModified: false,
                    initializedAt: new Date(),
                    pastSections: [],
                    futureSections: [],
                })
            },

            setInitialLayoutData: (initialLayoutData) => {
                set({
                    initialLayoutData,
                    isModified: false,
                })
            },

            clearState: () => set(emptyState),

            reorderLayoutSections: (sections) => {
                set((state) => {
                    const reorderedSections = sections.map((section, index) => ({
                        ...section,
                        zIndex: sections.length - index,
                    }))

                    return {
                        pastSections: state.sections ? [...state.pastSections, state.sections] : state.pastSections,
                        futureSections: [],
                        sections: reorderedSections,
                    }
                })
                get().checkLayoutModified()
            },

            removeSection: (id) => {
                set((state) => {
                    const sections = state.sections

                    if (!sections) return state

                    return {
                        pastSections: [...state.pastSections, sections],
                        futureSections: [],
                        sections: sections.filter((section) => section.id !== id),
                    }
                })
                get().checkLayoutModified()
            },

            updateSection: (section) => {
                const sections = get().sections

                if (!sections) return

                const sectionIndex = sections.findIndex((currentSection) => currentSection.id === section.id)

                if (sectionIndex === -1) return

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { zIndex, ...data } = section
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { zIndex: oldZIndex, ...oldData } = sections[sectionIndex]

                if(isEqual(data, oldData)) return

                const updatedSection = {
                    ...sections[sectionIndex],
                    ...data,
                }

                const newSections = [...sections]

                newSections[sectionIndex] = updatedSection

                set((state) => ({
                    pastSections: [...state.pastSections, sections],
                    futureSections: [],
                    sections: newSections,
                }))

                get().checkLayoutModified()
            },

            setSections: (sections) => {
                set((state) => ({
                    pastSections: state.sections ? [...state.pastSections, state.sections] : state.pastSections,
                    futureSections: [],
                    sections,
                }))
            },

            undo: () => {
                set((state) => {
                    if (state.pastSections.length === 0 || !state.sections) return state
                    const previous = state.pastSections[state.pastSections.length - 1]
                    const newPast = state.pastSections.slice(0, -1)

                    return {
                        sections: previous,
                        pastSections: newPast,
                        futureSections: [state.sections, ...state.futureSections],
                    }
                })
                get().checkLayoutModified()
            },

            redo: () => {
                set((state) => {
                    if (state.futureSections.length === 0 || !state.sections) return state
                    const next = state.futureSections[0]
                    const newFuture = state.futureSections.slice(1)

                    return {
                        sections: next,
                        pastSections: [...state.pastSections, state.sections],
                        futureSections: newFuture,
                    }
                })
                get().checkLayoutModified()
            },
        }),
        {
            name: 'playlist-layout-editor-storage',
        }
    )
)

export const usePlaylistLayoutEditorHistory = () => {
    const canUndo = usePlaylistLayoutEditorStorage((state) => state.pastSections.length > 0)
    const canRedo = usePlaylistLayoutEditorStorage((state) => state.futureSections.length > 0)
    const undo = usePlaylistLayoutEditorStorage((state) => state.undo)
    const redo = usePlaylistLayoutEditorStorage((state) => state.redo)

    return { canUndo, canRedo, undo, redo }
}
