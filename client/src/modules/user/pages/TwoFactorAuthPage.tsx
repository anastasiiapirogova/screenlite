import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FullWidthSettingsPageHeader } from '../components/FullWidthSettingsPageHeader'
import { totpSetupDataQuery } from '../api/queries/totpSetupDataQuery'
import { QRCodeSVG } from 'qrcode.react'
import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { TbInfoCircle } from 'react-icons/tb'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { EnableTwoFaData, enableTwoFaRequest } from '../api/requests/enableTwoFaRequest'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { Input } from '@shared/ui/input/Input'
import { InputError } from '@shared/ui/input/InputError'
import { currentUserQuery } from '@modules/auth/api/queries/currentUser'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'
import { Button } from '@shared/ui/buttons/Button'
import { disableTwoFaRequest } from '../api/requests/disableTwoFaRequest'

const TwoFactorEnabledState = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => disableTwoFaRequest(),
        onSuccess: async (screen) => {
            queryClient.setQueryData(currentUserQuery().queryKey, screen)
        },
        onError: (error) => {
            handleAxiosFieldErrors(error, console.log)
        }
    })

    const onSubmit = () => {
        mutate()
    }

    return (
        <div>
            <div>
                Two-factor authentication is enabled.
            </div>
            <div className='flex justify-end items-center gap-2 mt-5'>
                <Button
                    onClick={ () => onSubmit() }
                    type='submit'
                    disabled={ isPending }
                    variant='solid'
                    color='danger'
                >
                    Disable
                </Button>
            </div>
        </div>
    )
}

const Notification = () => (
    <div className='bg-slate-100 rounded-xl p-5 flex gap-5 text-sm'>
        <div>
            <TbInfoCircle
                className='text-blue-600'
                size={ 24 }
            />
        </div>
        <div>
            <div className='text-blue-600 font-medium'>
                A new QR code is generated each time you reload this page.
            </div>
            <div className='text-slate-600 mt-2'>
                If you scanned a QR code but then reloaded or left the page without entering the verification code, you'll need to delete the previous entry from your authenticator app and scan the newly generated QR code.
            </div>
        </div>
    </div>
)

const TwoFactorSetup = () => {
    const { data } = useQuery(totpSetupDataQuery())
    const queryClient = useQueryClient()

    const {
        control,
        handleSubmit,
        setError,
        getValues,
        formState: { errors, isDirty },
        reset
    } = useForm<EnableTwoFaData>({
        defaultValues: {
            token: ''
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: EnableTwoFaData) => enableTwoFaRequest(data),
        onSuccess: async (screen) => {
            queryClient.setQueryData(currentUserQuery().queryKey, screen)
            reset(getValues())
        },
        onError: (error) => {
            handleAxiosFieldErrors<EnableTwoFaData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<EnableTwoFaData> = (data) => {
        mutate(data)
    }

    if (!data) {
        return <div className='text-red-500'>Failed to load two-factor authentication setup data.</div>
    }

    return (
        <div className='m-5 flex flex-col gap-5'>
            <div className='text-xl'>
                Set up two-factor authentication
            </div>
            <div className='text-lg'>
                Step 1: Scan the QR code below with your TOTP app (e.g., Google Authenticator, Microsoft Authenticator).
            </div>
            <div className='flex bg-slate-100 p-5 gap-5 rounded-xl items-center'>
                <div className='bg-white p-5 rounded-xl'>
                    <QRCodeSVG value={ data.authUrl } />
                </div>
                <div>
                    <div>
                        If you cannot scan the QR code, you can manually enter the following secret key into your TOTP app:
                    </div>
                    <div className='text-xl font-mono bg-white inline-block p-2 px-4 rounded-lg mt-2'>
                        { data.secret }
                    </div>
                </div>
            </div>
            <Notification />
            <div className='text-lg'>
                Step 2: Enter the verification code from your TOTP app below.
            </div>
            <form
                onSubmit={ handleSubmit(onSubmit) }
                className='w-full flex flex-col gap-2'
            >
                <InputLabelGroup
                    label='Verification code'
                    name='token'
                >
                    <Controller
                        name='token'
                        control={ control }
                        render={ ({ field }) => (
                            <Input
                                { ...field }
                                type='text'
                            />
                        ) }
                    />
                    <InputError error={ errors.token?.message }/>
                </InputLabelGroup>
                <div className='flex justify-end items-center gap-2 mt-5'>
                    <Button
                        type='submit'
                        disabled={ isPending || isDirty === false }
                        variant='solid'
                    >
                        Enable
                    </Button>
                </div>
            </form>
        </div>
    )
	
}

export const TwoFactorAuthPage = () => {
    const user = useCurrentUser()

    return (
        <div className='flex flex-col grow w-full overflow-hidden'>
            <FullWidthSettingsPageHeader backLink='/security'>
                Two factor authentication
            </FullWidthSettingsPageHeader>
            <ScrollArea verticalMargin={ 24 }>
                <div className='max-w-screen-md mx-auto p-5'>
                    {
                        user.twoFactorEnabled ? (
                            <TwoFactorEnabledState />
                        ) : (
                            <TwoFactorSetup />
                        )
                    }
                </div>
            </ScrollArea>
        </div>
    )
}
