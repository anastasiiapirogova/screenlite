import { Link } from 'react-router'

export const SessionsSettingsCard = () => {
    return (
        <div className='p-5'>
            Sessions
            <Link
                to="/settings/sessions"
                className='text-blue-500 hover:underline'
            >
                Go
            </Link>
        </div>
    )
}
