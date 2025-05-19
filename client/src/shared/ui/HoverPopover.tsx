import {
    useDismiss,
    useRole,
    useInteractions,
    FloatingFocusManager,
    autoUpdate,
    useFloating,
    offset,
    flip,
    shift,
    useHover,
    useClick,
} from '@floating-ui/react'
import { ReactNode, useState } from 'react'
   
export const HoverPopover = ({ children, popoverBody }: { children: ReactNode, popoverBody: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
   
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset(5), flip(), shift()],
        whileElementsMounted: autoUpdate,
    })
   
    const click = useClick(context)
    const hover = useHover(context)
    const dismiss = useDismiss(context)
    const role = useRole(context)
   
    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        hover,
        dismiss,
        role,
    ])

    return (
        <>
            <div
                ref={ refs.setReference }
                { ...getReferenceProps() }
                onMouseLeave={ () => setIsOpen(false) }
            >
                { children }
            </div>
            { isOpen && (
                <FloatingFocusManager
                    context={ context }
                    modal={ false }
                >
                    <div
                        ref={ refs.setFloating }
                        style={ floatingStyles }
                        { ...getFloatingProps() }
                    >
                        { popoverBody }
                    </div>
                </FloatingFocusManager>
            ) }
        </>
    )
}