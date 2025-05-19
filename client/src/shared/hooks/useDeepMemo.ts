import { useRef } from 'react'
import { isEqual } from 'lodash'

export function useDeepMemo<T>(factory: () => T, dependencies: unknown[]): T {
    const ref = useRef<{
      deps: unknown[];
      value: T;
    } | null>(null)
  
    const current = ref.current
    const hasChanged = !current || !isEqual(dependencies, current.deps)
  
    if (hasChanged) {
        ref.current = {
            deps: dependencies,
            value: factory(),
        }
    }
  
    return ref.current!.value
}