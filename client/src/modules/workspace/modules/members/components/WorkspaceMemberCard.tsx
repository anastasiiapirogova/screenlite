import { Button } from "@shared/ui/buttons/Button"
import { Member } from "../types"
import { RemoveMemberButton } from "./buttons/RemoveMemberButton"

export const WorkspaceMemberCard = ({ member }: { member: Member }) => {
    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <div className='w-10 h-10 rounded-full bg-gray-200'></div>
                <div className='text-sm font-medium'>{ member.user.name }</div>
            </div>
            <div className='flex items-center gap-2'>
                <RemoveMemberButton member={ member }>
                    <Button color='danger' variant='soft'>Remove</Button>
                </RemoveMemberButton>
            </div>
        </div>
    )
}