import { useContext } from 'react'
import { ScreenContext } from '../contexts/ScreenContext'

function useScreen() {
    const context = useContext(ScreenContext)

    if (!context) {
        throw new Error('useScreen must be used within a ScreenProvider')
    }

    return context
}

export { useScreen }