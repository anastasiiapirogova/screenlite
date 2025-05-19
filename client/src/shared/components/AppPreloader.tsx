import { motion } from 'motion/react'

export const AppPreloader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <motion.div
                initial={ { opacity: 0 } }
                animate={ { opacity: 1 } }
                transition={ { duration: 1, ease: 'easeInOut' } }
                className="text-4xl font-bold"
            >
                Screenlite
            </motion.div>
        </div>
    )
}