import { ReactNode } from 'react'

const SettingsCardTitle = ({ children }: { children: ReactNode }) => (
    <div className='text-xl mb-2'>
        { children }
    </div>
)

const SettingsCardDescription = ({ children }: { children?: ReactNode }) => {
    if (!children) return null
    return <div className='text-gray-500 mb-4'>{ children }</div>
}

export const SettingsCard = ({
    title,
    description,
    children,
}: {
	title: string
	description?: string
	children: ReactNode
}) => {
    return (
        <div className='p-7 border border-neutral-200 rounded-xl'>
            <SettingsCardTitle>{ title }</SettingsCardTitle>
            <SettingsCardDescription>{ description }</SettingsCardDescription>
            { children }
        </div>
    )
}
