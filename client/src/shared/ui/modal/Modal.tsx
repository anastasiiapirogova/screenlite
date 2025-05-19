import { Dialog, DialogClose, DialogContent, DialogDescription, DialogPortal, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import React, { ReactElement, ReactNode } from 'react'
import { ModalOverlay } from './ModalOverlay'
import { twMerge } from 'tailwind-merge'
import { TbX } from 'react-icons/tb'

type Props = {
    children: ReactNode
    trigger: ReactElement
    title?: string
    description?: string
    maxWidth?: string
    open: boolean
    showClose?: boolean
    onOpenChange: (open: boolean) => void
}

export const ModalClose = DialogClose

export const ModalDescription = DialogDescription

export const ModalCloseButton = () => (
    <DialogClose asChild>
        <button
            className="absolute right-4 top-4 inline-flex size-10 appearance-none items-center justify-center rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
        >
            <TbX className='w-6 h-6 text-neutral-500'/>
        </button>
    </DialogClose>
)

export const Modal = ({
    children,
    trigger,
    title,
    maxWidth = 'max-w-[500px]',
    showClose = true,
    open,
    onOpenChange
}: Props) => (
    <Dialog
        open={ open }
        onOpenChange={ onOpenChange }
    >
        <DialogTrigger asChild>
            { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
            { React.cloneElement(trigger as ReactElement<any>, { onClick: trigger.type === 'button' ? undefined : () => onOpenChange(true) }) }
        </DialogTrigger>
        <DialogPortal>
            <ModalOverlay />
            <DialogContent
                className={
                    twMerge(
                        'fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white py-7 shadow-[var(--shadow-6)] focus:outline-hidden data-[state=open]:animate-contentShow overflow-hidden flex flex-col',
                        maxWidth
                    )
                }
                aria-describedby={ undefined }
            >
                <DialogTitle
                    autoFocus
                    tabIndex={ 0 }
                    className={
                        twMerge(
                            'focus:outline-hidden',
                            'text-xl font-medium leading-4',
                            'px-7'
                        )
                    }
                >
                    { title }
                </DialogTitle>
                { children }
                {
                    showClose && <ModalCloseButton />
                }
            </DialogContent>
        </DialogPortal>
    </Dialog>
)