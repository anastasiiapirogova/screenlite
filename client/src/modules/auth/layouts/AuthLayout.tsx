import { Outlet, useLocation } from 'react-router'
import { motion } from 'motion/react'

export const AuthLayout = () => {
    const location = useLocation()

    return (
        <div>
            <motion.div
                key={ location.pathname }
                initial="initial"
                animate={ { opacity: 1 } }
                transition={ { duration: 0.5, ease: 'easeInOut' } }
                style={ {
                    opacity: 0
                } }
                className='min-h-screen min-w-full flex items-center justify-center'
            >
                <Outlet />
            </motion.div>
        </div>
    )
}
