import { DeleteScreenButton } from '../components/DeleteScreenButton'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { useScreen } from '../hooks/useScreen'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { Button } from '@shared/ui/buttons/Button'
import { ConnectDeviceButton } from '../components/ConnectDeviceButton'
import { DeviceTemp } from '../components/DeviceTemp'

export const WorkspaceScreenPage = () => {
    const screen = useScreen()

    return (
        <div className='flex gap-2 grow'>
            <div className='w-[325px] shrink-0'>
                <LayoutBodyContainer>
                    <ScrollArea verticalMargin={ 24 }>
                        <div className='p-7'>
                            sidebar
                        </div>
                    </ScrollArea>
                </LayoutBodyContainer>
            </div>
					
            <LayoutBodyContainer>
                <ScrollArea verticalMargin={ 24 }>
                    <div className='p-7 flex justify-between items-center'>
                        <div>
                            <div>
                                Back to screens
                            </div>
                            <h1 className='text-3xl font-semibold'>
                                { screen.name }
                            </h1>
                            <div>
                                Resolution: { screen.resolutionWidth } x { screen.resolutionHeight }
                            </div>
                        </div>
                        <div>
                            {
                                !screen.device && (
                                    <ConnectDeviceButton buttonText="Connect device" />
                                )
                            }
                        </div>
                    </div>
                    <div>
                        {
                            screen.device && (
                                <DeviceTemp device={ screen.device }/>
                            )
                        }
                    </div>
                    <div className='p-7'>
                        <div className='flex items-center justify-between py-5'>
                            <div>
                                Delete screen
                            </div>
                            <div>
                                <DeleteScreenButton>
                                    <Button
                                        variant='soft'
                                        color='danger'
                                    >
                                        Delete
                                    </Button>
                                </DeleteScreenButton>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </LayoutBodyContainer>
        </div>
        
    )
}
