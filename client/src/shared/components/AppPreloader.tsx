import { motion } from 'motion/react'

export const AppPreloader = ({ error }: { error: Error | null }) => {
    const errorMessage = error?.message || 'Something went wrong'

    return (
        <div className="flex items-center justify-center h-screen">
            <motion.div
                initial={ { opacity: 0 } }
                animate={ { opacity: 1 } }
                transition={ { duration: 1, ease: 'easeInOut' } }
                className="flex flex-col items-center text-center"
            >
                <div className="text-4xl font-bold">
                    Screenlite
                </div>
                <div className='text-sm text-neutral-500 mt-2'>
                    {
                        error ? errorMessage : 'Connecting to the server...'
                    }
                </div>
            </motion.div>
        </div>
    )
}