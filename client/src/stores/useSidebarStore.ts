import { create } from 'zustand'

export type SidebarState = {
  visible: boolean
  mounted: boolean
}

export type SidebarStore = {
  sidebars: Record<string, SidebarState>
  setSidebar: (key: string, state: Partial<SidebarState>) => void
  toggleSidebar: (key: string) => void
  getSidebar: (key: string) => SidebarState
  resetSidebar: (key: string) => void
}

const defaultSidebarState: SidebarState = { visible: true, mounted: true }

export const useSidebarStore = create<SidebarStore>((set, get) => ({
    sidebars: {},
    setSidebar: (key, state) =>
        set((s) => ({
            sidebars: {
                ...s.sidebars,
                [key]: { ...defaultSidebarState, ...s.sidebars[key], ...state },
            },
        })),
    toggleSidebar: (key) => {
        const prev = get().sidebars[key] || defaultSidebarState

        if (prev.visible) {
            set((s) => ({
                sidebars: {
                    ...s.sidebars,
                    [key]: { ...prev, visible: false, mounted: true },
                },
            }))
            setTimeout(() => {
                set((s2) => ({
                    sidebars: {
                        ...s2.sidebars,
                        [key]: { ...prev, visible: false, mounted: false },
                    },
                }))
            }, 300)
        } else {
            set((s) => ({
                sidebars: {
                    ...s.sidebars,
                    [key]: { ...prev, visible: false, mounted: true },
                },
            }))
            setTimeout(() => {
                set((s2) => ({
                    sidebars: {
                        ...s2.sidebars,
                        [key]: { ...prev, visible: true, mounted: true },
                    },
                }))
            }, 10)
        }
    },
    getSidebar: (key: string): SidebarState => get().sidebars[key] || defaultSidebarState,
    resetSidebar: (key) =>
        set((s) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [key]: _, ...rest } = s.sidebars
            
            return { sidebars: rest }
        }),
})) 