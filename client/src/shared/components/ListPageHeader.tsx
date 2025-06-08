type PageHeaderProps = {
	title: string
	count?: number
	children?: React.ReactNode
}

export const ListPageHeader = ({ title, count, children }: PageHeaderProps) => {
    return (
        <div className='bg-white flex w-full justify-between items-center p-7 py-4'>
            <div className='flex items-center gap-3 text-2xl font-semibold'>
                <h1>{ title }</h1>
                {
                    count !== undefined && (
                        <span className='text-primary leading-4 py-1.5 text bg-blue-100 px-3.5 rounded-full '>
                            { count }
                        </span>
                    )
                }
            </div>
            { children }
        </div>
    )
}
