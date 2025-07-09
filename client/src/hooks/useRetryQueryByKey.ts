import { useQueryClient } from '@tanstack/react-query'

export function useRetryQueryByKey(queryKey: unknown[]) {
    const queryClient = useQueryClient()

    const retry = () => {
        queryClient.invalidateQueries({
            queryKey,
            refetchType: 'active',
        })
    }

    return {
        retry,
    }
}
