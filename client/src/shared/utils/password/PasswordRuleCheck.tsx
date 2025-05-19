import { TbCheck, TbProgressX } from 'react-icons/tb'

type Props = {
  condition: boolean
  message: string
}

export const PasswordRuleCheck = ({ condition, message }: Props) => {
    return (
        <div className="flex items-center mt-1">
            <div className={ `mr-2 ${condition ? 'text-green-500' : ''}` }>
                { condition ? <TbCheck className='w-5 h-5'/> : <TbProgressX className='w-5 h-5'/> }
            </div>
            <span className={ `${condition ? 'text-green-500' : ''}` }>{ message }</span>
        </div>
    )
}
