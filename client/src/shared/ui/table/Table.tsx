import React, { ReactNode } from 'react'

type ColumnConfig<T> = {
    key: string
    header: ReactNode
    render: (row: T) => ReactNode
    style?: React.CSSProperties
    headerClassName?: string
    cellClassName?: string
}

type TableProps<T> = {
    columns: ColumnConfig<T>[]
    data: T[]
    rowKey: (row: T) => string | number
    onClickRow?: (row: T) => void
    containerClassName?: string
    rowClassName?: string
    headerClassName?: string
    columnHeaderClassName?: string
    columnCellClassName?: string
}

export function Table<T>({
    columns,
    data,
    rowKey,
    onClickRow,
    containerClassName,
    rowClassName,
    headerClassName,
    columnHeaderClassName,
    columnCellClassName,
}: TableProps<T>) {
    return (
        <div
            className={ containerClassName }
            style={ { display: 'flex', flexDirection: 'column' } }
        >
            <div
                style={ { display: 'flex' } }
                className={ headerClassName }
            >
                { columns.map((col) => (
                    <div
                        key={ col.key }
                        className={ `${columnHeaderClassName || ''} ${col.headerClassName || ''}`.trim() }
                        style={ { flex: 1, ...col.style } }
                    >
                        { col.header }
                    </div>
                )) }
            </div>

            { data.map((row) => (
                <div
                    key={ rowKey(row) }
                    className={ rowClassName }
                    style={ { display: 'flex' } }
                    onClick={ () => onClickRow?.(row) }
                >
                    { columns.map((col) => (
                        <div
                            key={ col.key }
                            className={ `${columnCellClassName || ''} ${col.cellClassName || ''}`.trim() }
                            style={ { flex: 1, ...col.style } }
                        >
                            { col.render(row) }
                        </div>
                    )) }
                </div>
            )) }
        </div>
    )
}