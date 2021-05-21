import { ForwardedRef, RefObject, useEffect, useRef } from 'react'

const useCombinedRefs = <T>(...refs: Array<ForwardedRef<T>>) => {
    const targetRef = useRef<T>(null)
    useEffect(() => {
        refs.filter(Boolean).forEach((ref) => {
            if (typeof ref === 'function') {
                ref(targetRef.current)
            } else {
                ref!.current = targetRef.current
            }
        })
    }, [refs])
    return targetRef as RefObject<T>
}

export default useCombinedRefs
