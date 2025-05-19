import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type UrlParams = { [key: string]: string } | undefined

type State = {
    urlParams: UrlParams
    setUrlParams: (params: UrlParams) => void
}

export const usePreviousUrlParamsStorage = create<State>()(
    devtools(
        (set) => ({
            urlParams: undefined,
            setUrlParams: (params) => set({ urlParams: params }),
        }),
        {
            name: 'previous-url-parameters-storage',
        },
    ),
)
