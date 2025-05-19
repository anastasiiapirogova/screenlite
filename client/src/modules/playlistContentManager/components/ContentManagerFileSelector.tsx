import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { Input } from '@shared/ui/input/Input'
import { FileSelectorFileList } from './FileSelector/FileSelectorFileList'

export const ContentManagerFileSelector = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    return (
        <>
            <div className='mb-4'>
                <Input
                    value={ searchTerm }
                    onChange={ (e) => setSearchTerm(e.target.value) }
                    placeholder="Search files..."
                />
            </div>
            <QueryErrorResetBoundary>
                <ErrorBoundary fallbackRender={ () => (
                    <div>
                        There was an error!
                    </div>
                ) }
                >
                    <Suspense fallback={ <>Loading</> }>
                        <FileSelectorFileList search={ debouncedSearchTerm }/>
                    </Suspense>
                </ErrorBoundary>
            </QueryErrorResetBoundary>
        </>
    )
}
