import { Button } from '@shared/ui/buttons/Button'
import { ReactNode } from 'react'

interface FilterGroupProps {
    label: string;
    showClearButton: boolean;
    clear: () => void;
    children: ReactNode;
}

export const SidebarFilterGroup = ({ label, showClearButton, clear, children }: FilterGroupProps) => {
    return (
        <div className='flex flex-col'>
            <div className='flex w-full justify-between items-center h-10'>
                <div>
                    { label }
                </div>
                {
                    showClearButton && (
                        <div>
                            <Button
                                size="small"
                                color='secondary'
                                variant='soft'
                                onClick={ clear }
                            >
                                Clear
                            </Button>
                        </div>
                    )
                }
            </div>
            { children }
        </div>
    )
}
