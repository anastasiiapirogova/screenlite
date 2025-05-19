import { Button } from './buttons/Button'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'

type Props = {
    page: number;
    pages: number | undefined;
    onPageChange: (page: number) => void;
}

export const Pagination = ({
    page,
    pages,
    onPageChange,
}: Props) => {
    if(!pages) {
        return null
    }
    
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pages) {
            onPageChange(page)
        }
    }

    return (
        <nav className='py-10 flex justify-around items-center'>
            <div className='flex items-center gap-5'>
                <Button
                    color='secondary'
                    variant='soft'
                    size='squareLarge'
                    onClick={ () => handlePageChange(page - 1) }
                    disabled={ page === 1 }
                    icon={ TbChevronLeft }

                />
                <span className='font-medium'>{ `Page ${page} of ${pages}` }</span>
                <Button
                    onClick={ () => handlePageChange(page + 1) }
                    color='secondary'
                    variant='soft'
                    size='squareLarge'
                    disabled={ page === pages }
                    icon={ TbChevronRight }
                />
            </div>
        </nav>
    )
}
