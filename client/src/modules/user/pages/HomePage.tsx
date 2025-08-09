import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { useConfig } from '@modules/config/hooks/useConfig'

export const HomePage = () => {
    const config = useConfig()
    const user = useCurrentUser()

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Screenlite</h1>
                <p className="text-gray-600 text-lg mt-2">Open-source digital signage CMS</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">You're logged in as</h2>
                <div className="text-sm text-gray-700 space-y-2">
                    <p>
                        <span className="font-medium">Name:</span>{ ' ' }
                        <span className="font-mono text-gray-900">{ user?.name }</span>
                    </p>
                    <p>
                        <span className="font-medium">Email:</span>{ ' ' }
                        <span className="font-mono text-gray-900">{ user?.email }</span>
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Backend Info</h2>
                <div className="text-sm text-gray-700 space-y-2">
                    <p>
                        <span className="font-medium">Environment:</span>{ ' ' }
                        <span className="inline-block px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono text-gray-900">
                            { config.app.environment }
                        </span>
                    </p>
                    <p>
                        <span className="font-medium">Version:</span>{ ' ' }
                        <span className="font-mono text-gray-900">{ config.app.backendVersion }</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
