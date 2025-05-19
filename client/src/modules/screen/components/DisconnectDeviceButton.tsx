import { useState } from 'react'
import { DisconnectDeviceForm } from './DisconnectDeviceForm'
import { Modal } from '@shared/ui/modal/Modal'

export const DisconnectDeviceButton = ({ buttonText }: { buttonText: string }) => {
    const [open, setOpen] = useState(false)

    return (
        <Modal
            open={ open }
            title="Disconnect device" 
            onOpenChange={ setOpen }
            trigger={
                <div className='cursor-pointer text-red-300 hover:text-red-600 transition-colors'>
                    { buttonText }
                </div>
            }
        >
            <div className='max-w-[500px]'>
                <DisconnectDeviceForm onClose={ () => setOpen(false) }/>
            </div>
        </Modal>
    )
}
