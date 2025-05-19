import { ReactElement } from 'react'

type Props = {
    sidebar: ReactElement
    children: ReactElement
}

export const InnerSidebarLayout = ({ sidebar, children }: Props) => {
    return (
        <div className='flex gap-5 grow'>
            <div className='grow p-5'>
                <div className='bg-white p-2 border rounded-lg'>
                    { children }
                </div>
            </div>
            <div className='w-[275px] bg-white p-2 border-l'>
                { sidebar }
            </div>
        </div>
    )
}
