import { ReactNode } from 'react'
import { ConfigContext } from '../contexts/ConfigContext'
import { useQuery } from '@tanstack/react-query'
import { configQuery } from '../api/getConfig'
import { AppPreloader } from '@shared/components/AppPreloader'
import { Outlet } from 'react-router'

export const ConfigProvider = ({ children }: { children?: ReactNode }) => {
    const { data: config, error } = useQuery(configQuery())

    if (!config) {
        return <AppPreloader error={ error } />
    }

    return (
        <ConfigContext.Provider value={ config }>
            { children || <Outlet /> }
        </ConfigContext.Provider>
    )
}