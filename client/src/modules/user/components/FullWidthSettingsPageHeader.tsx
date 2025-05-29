import { Button } from '@shared/ui/buttons/Button'
import { ReactNode } from 'react'
import { TbChevronLeft } from 'react-icons/tb'

export const FullWidthSettingsPageHeader = ({ backLink, children }: { backLink: string, children: ReactNode }) => {
    return (
        <div className="p-5 border-b border-neutral-200 text-2xl flex items-center gap-4">
            <Button
                to={ backLink }
                color='secondary'
                variant="soft"
                size='squareLarge'
                icon={ TbChevronLeft }
            />
            <div>
                { children }
            </div>
        </div>
    )
}
