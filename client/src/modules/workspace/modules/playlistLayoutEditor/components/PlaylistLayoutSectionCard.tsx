import { useSortable } from '@dnd-kit/sortable'
import { forwardRef, useEffect } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Accordion } from 'radix-ui'
import { twMerge } from 'tailwind-merge'
import { prettyResolution } from '@shared/helpers/prettyResolution'
import { usePlaylistLayoutEditorStorage } from '@stores/usePlaylistLayoutEditorStorage'
import { Button } from '@shared/ui/buttons/Button'
import { TbMenu, TbX } from 'react-icons/tb'
import { Controller, useForm } from 'react-hook-form'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { Input } from '@shared/ui/input/Input'
import { InputError } from '@shared/ui/input/InputError'
import { PlaylistLayoutEditorLayoutSection } from '../types'
import { isSectionVisible } from '../helpers/isSectionVisible'

type Props = {
    section: PlaylistLayoutEditorLayoutSection
    isDragging?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const PlaylistLayoutSectionCard = forwardRef<HTMLDivElement, Props>(({ section, isDragging, ...props }, ref) => {
    return (
        <div
            { ...props }
            className={ [
                'p-3',
                isDragging ? 'bg-blue-50' : 'hover:bg-gray-100',
            ].join(' ') }
            ref={ ref }
        >
            { section.name }
        </div>
    )
})

const SectionEditForm = ({ section }: { section: PlaylistLayoutEditorLayoutSection }) => {
    const { updateSection } = usePlaylistLayoutEditorStorage()

    const {
        control,
        formState: { errors },
        watch,
    } = useForm<PlaylistLayoutEditorLayoutSection>({
        defaultValues: section
    })

    const fields = watch()

    useEffect(() => {
        updateSection({
            ...fields
        })
    }, [fields, updateSection, section.id])

    return (
        <div className='p-5 pt-0'>
            <InputLabelGroup
                label='Name'
                name='name'
            >
                <Controller
                    name='name'
                    control={ control }
                    render={ ({ field }) => (
                        <Input
                            { ...field }
                            type='text'
                            placeholder='John Doe'
                        />
                    ) }
                />
                <InputError error={ errors.name?.message }/>
            </InputLabelGroup>
            <InputLabelGroup
                label='Width'
                name='width'
            >
                <Controller
                    name='width'
                    control={ control }
                    render={ ({ field }) => (
                        <Input
                            { ...field }
                            type='number'
                            placeholder='John Doe'
                        />
                    ) }
                />
                <InputError error={ errors.width?.message }/>
            </InputLabelGroup>
            <InputLabelGroup
                label='Height'
                name='height'
            >
                <Controller
                    name='height'
                    control={ control }
                    render={ ({ field }) => (
                        <Input
                            { ...field }
                            type='number'
                            placeholder='John Doe'
                        />
                    ) }
                />
                <InputError error={ errors.height?.message }/>
            </InputLabelGroup>
            <InputLabelGroup
                label='Top'
                name='top'
            >
                <Controller
                    name='top'
                    control={ control }
                    render={ ({ field }) => (
                        <Input
                            { ...field }
                            type='number'
                            placeholder='John Doe'
                        />
                    ) }
                />
                <InputError error={ errors.top?.message }/>
            </InputLabelGroup>
            <InputLabelGroup
                label='Left'
                name='left'
            >
                <Controller
                    name='left'
                    control={ control }
                    render={ ({ field }) => (
                        <Input
                            { ...field }
                            type='number'
                            placeholder='John Doe'
                        />
                    ) }
                />
                <InputError error={ errors.left?.message }/>
            </InputLabelGroup>
        </div>
    )
}

export const PlaylistLayoutSortableSectionCard = (props: { section: PlaylistLayoutEditorLayoutSection }) => {
    const { section } = props

    const { removeSection, sections } = usePlaylistLayoutEditorStorage()
    
    const isVisible = sections ? isSectionVisible(section.id, sections) : false

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: section.id,
        data: {
            section,
            action: 'sort',
            modifiers: [restrictToVerticalAxis, restrictToParentElement],
        }
    })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
        touchAction: 'none',
        userSelect: 'none',
    }

    return (
        <Accordion.Item
            ref={ setNodeRef }
            className={ twMerge(
                'overflow-hidden bg-neutral-50 hover:bg-neutral-100 rounded-lg',
            ) }
            style={ style }
            value={ section.id }
        >
            <Accordion.Header className="flex">
                <Accordion.Trigger
                    className={ twMerge(
                        'flex flex-1 items-center justify-between text-[15px] outline-hidden p-5',
                    ) }
                    asChild
                >
                    <div className='flex grow justify-between items-center gap-5'>
                        <div className='flex gap-2 items-center'>
                            <div
                                { ...attributes }
                                { ...listeners }
                                className='cursor-grab'
                            >
                                <TbMenu className='w-5 h-5 text-neutral-400'/>
                            </div>
                            <div>
                                <div className='text-left'>
                                    { section.name }
                                </div>
                                { prettyResolution(section) }
                                x: { section.top } y: { section.left }
                            </div>
                            <div>
                                { isVisible ? 'Visible' : 'Not visible' }
                            </div>
                        </div>
                        <Button
                            onClick={ () => removeSection(section.id) }
                            color='secondary'
                            variant='soft'
                            size='squareSmall'
                            icon={ TbX }
                        />
                    </div>
                </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={ twMerge(
                'overflow-hidden bg-mauve2 text-[15px] text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown',
            ) }
            >
                <SectionEditForm section={ section } />
            </Accordion.Content>
        </Accordion.Item>
    )
}