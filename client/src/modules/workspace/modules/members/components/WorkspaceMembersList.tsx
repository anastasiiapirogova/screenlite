import { WorkspaceMemberCard } from './WorkspaceMemberCard'
import { Member } from '../types'

export const WorkspaceMembersList = ({ members }: { members: Member[] }) => {
    return (
        <div>
            { members.map((member) => (
                <div key={ member.userId }>
                    <WorkspaceMemberCard member={ member } />
                </div>
            )) }
        </div>
    )
}