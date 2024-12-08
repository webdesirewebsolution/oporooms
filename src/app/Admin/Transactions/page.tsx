'use client'

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { TypeSafeColDef } from '@/Types/DataGridTypes'
import { Context } from '@/Context/context'
import { Paper } from '@mui/material'
import { TransactionAction, TransactionType } from '@/Types/Transaction'

const Transaction = () => {
    const { user } = useContext(Context)
    const [data, setData] = useState<TransactionType[]>([])
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        pageSize: 10
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            setLoading(true)
            if (user?.userRole !== '') {
                await axios.get(`/api/transactions?page=${filter.page * 10}&pageSize=${filter?.pageSize}`).then(r => {
                    if (r.status == 200) {
                        setData(r.data?.list)
                        setCount(r.data?.count)
                    }
                }).finally(() => setLoading(false))
            }
        })()
    }, [filter, user])


    const columns: TypeSafeColDef<TransactionAction>[] = [
        { id: 0, field: '_id', headerName: 'Id' },
        { id: 10, field: 'action', headerName: 'Action' }
    ]

    columns.forEach((item) => {
        item.align = 'center';
        item.headerAlign = 'center'
    })

    return (
        <div className='flex flex-col gap-10'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-semibold'>Transactions</h1>
            </div>

            <Paper>
                <DataGrid
                    sx={{
                        minHeight: 200,
                        height: '100%'
                    }}
                    columns={columns}
                    rows={data}
                    loading={loading}
                    getRowId={row => row?._id}
                    isRowSelectable={() => false}
                    pagination
                    rowCount={count}
                    sortingMode='client'
                    filterMode='client'
                    paginationMode="server"
                    paginationModel={{
                        page: Number(filter.page),
                        pageSize: Number(filter.pageSize)
                    }}
                    onPaginationModelChange={setFilter}
                />
            </Paper>
        </div>
    )
}

export default Transaction