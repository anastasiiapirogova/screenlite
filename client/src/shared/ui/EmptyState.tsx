import React from 'react'

type Props = {
    header: string
    description: string
    primaryAction: React.ReactNode
    imageUrl?: string
}

export const EmptyState = ({
    header,
    description,
    primaryAction,
    imageUrl
}: Props) => {
    return (
        <div className="flex grow flex-col items-center justify-center p-4">
            {
                imageUrl && (
                    <img
                        src={ imageUrl }
                        alt="Empty state"
                        className="w-32 h-32 mb-4"
                    />
                )
            }
            <h2 className={ 'text-xl font-bold mb-2' }>{ header }</h2>
            <p className="text-center text-gray-600 mb-4">{ description }</p>
            <div className="mt-4">{ primaryAction }</div>
        </div>
    )
}