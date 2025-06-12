import { useSearchCountStore } from '@stores/useSearchCountStore'
import { useShallow } from 'zustand/react/shallow'
import { useEffect } from 'react'
import { WorkspaceMembersRequestResponse } from '@modules/workspace/modules/members/api/requests/workspaceMembersRequest'

export const WorkspaceMembersPageList = ({ data, isLoading }: { data?: WorkspaceMembersRequestResponse, isLoading: boolean }) => {
    const setmemberCount = useSearchCountStore(useShallow(state => state.setMemberCount))

    useEffect(() => {
        if(data?.meta) {
            setmemberCount(data.meta.total)
        }
    }, [data, setmemberCount])

    if (isLoading || !data) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    const { data: members } = data

    if(members.length === 0) {
        return (
            <div>
                No members found
            </div>
        )
    }

    return (
        <div>
            <div className='flex flex-col gap-2'>
                {
                    members.map(
                        member => (
                            <div
                                key={ member.user.id }
                                className='flex gap-4 items-center p-2 cursor-default'
                            >
                                <div>
                                    <div>
                                        { member.user.name }
                                    </div>
                                    <div>
                                        { member.user.email }
                                    </div>
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}