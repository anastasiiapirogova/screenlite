import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type State = {
    playlistCount: number | undefined;
    playlistLayoutCount: number | undefined;
    screenCount: number | undefined;
    memberCount: number | undefined;
}

type Action = {
    setPlaylistCount: (count: number | undefined) => void;
    setPlaylistLayoutCount: (count: number | undefined) => void;
    setScreenCount: (count: number | undefined) => void;
    setMemberCount: (count: number | undefined) => void;
}

type SearchCountState = State & Action;

export const useSearchCountStore = create<SearchCountState>()(
    devtools(
        (set) => ({ 
            playlistCount: undefined,
            playlistLayoutCount: undefined,
            screenCount: undefined,
            memberCount: undefined,
            setMemberCount: (count) => set({ memberCount: count }),
            setPlaylistCount: (count) => set({ playlistCount: count }),
            setPlaylistLayoutCount: (count) => set({ playlistLayoutCount: count }),
            setScreenCount: (count) => set({ screenCount: count }),
        }),
        {
            name: 'search-count-storage',
        },
    ),
)