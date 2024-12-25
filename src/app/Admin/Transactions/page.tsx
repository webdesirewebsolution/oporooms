'use client'

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import { TypeSafeColDef } from '@/Types/DataGridTypes'
import { Button, FormControl, InputLabel, Menu, MenuItem, Paper, Select, TextField } from '@mui/material'
import { TransactionAction, TransactionType } from '@/Types/Transaction'
import moment from 'moment'
import Modal from '@/Components/Modal'
import AddTransactions from '../Components/AddTransactions'
import AddPay from '../Components/AddPay'
import { FaWallet } from 'react-icons/fa6'
import { Context } from '@/Context/context'

const Transaction = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [data, setData] = useState<TransactionType[]>([])
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState<{
        page: number, pageSize: number, status?: 'All' | 'pending' | 'completed' | 'cancelled',
        'payer.contact1'?: string,
        'receiver.contact1'?: string,
        from?: string | null,
        to?: string | null
    }>({
        page: 0,
        pageSize: 10,
        status: 'All',
        'payer.contact1': '',
        'receiver.contact1': '',
        'from': null,
        'to': null
    })
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState<'Add balance' | 'Pay' | ''>('')
    const open = Boolean(anchorEl);
    const { user } = useContext(Context)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const params = new URLSearchParams()

            Object.entries(filter)?.map(([key, value]) => {
                if (key == 'page') {
                    params.set(key, String(Number(value as number * 10)))
                } else if (value == '' || value == 'All' || value == null) {
                    params.delete(key)
                } else {
                    params.set(key, String(value))
                }
            })

            if (filter.from && filter.to && filter.from == filter.to) {
                params.delete('from')
                params.delete('to')
            }

            await axios.get(`/api/transactions?${params.toString()}`).then(r => {
                if (r.status == 200) {
                    setData(r.data?.list)
                    setCount(r.data?.count)
                }
            }).finally(() => setLoading(false))
        })()
    }, [filter])

    const columns: TypeSafeColDef<TransactionAction>[] = [
        { id: 0, field: '_id', headerName: 'Id' },
        { id: 2, field: 'bookings', headerName: 'booking_id', minWidth: 200, renderCell: (params) => <BookingDetails params={params} /> },
        { id: 1, field: 'amount', headerName: 'Amount' },
        // { id: 2, field: 'type', headerName: 'Type' },
        {
            id: 3, field: 'payer', headerName: 'Payer Name', minWidth: 200, renderCell: (params) => <UserDetails params={params} />
        },
        {
            id: 4, field: 'receiver', headerName: 'Receiver Name', minWidth: 300, renderCell: (params) => <UserDetails params={params} />
        },
        { id: 3, field: 'status', headerName: 'Status' },
        { id: 4, field: 'created_at', headerName: 'Created At', minWidth: 150, valueGetter: (value) => moment(new Date(value)).format('Do MMM YYYY') },
    ]

    columns.forEach((item) => {
        item.align = 'center';
        item.headerAlign = 'center'
    })

    return (
        <div className='flex flex-col gap-10'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-semibold'>Transactions</h1>
                <div>
                    <Button className='bg-red-500 text-white'
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={(e) => setAnchorEl(e.currentTarget)}>
                        Add Transactions
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem className='text-xl' onClick={() => setShow('Add balance')}>Add balance to company wallet</MenuItem>
                        <MenuItem className='text-xl' onClick={() => setShow('Pay')}>Pay to hotel owner</MenuItem>
                        <MenuItem className='text-xl' onClick={() => setShow('Pay')}>Pay to company</MenuItem>
                    </Menu>
                </div>
            </div>

            <div className='flex gap-10 flex-wrap'>
                <div className='shadow p-10 w-[30rem] max-w-full flex flex-col gap-5 rounded-2xl'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                        <div className='bg-red-100 p-4 rounded-xl'>
                            <FaWallet color='red' size={20} />
                        </div>
                        <h1 className='text-3xl'>Wallet Balance</h1>
                        </div>
                        <p className='text-4xl font-semibold'>&#8377;{user?.wallet}</p>
                    </div>
                </div>
                {/* <div className='shadow p-10 w-[30rem] max-w-full flex flex-col gap-5 rounded-2xl'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-3xl'>Recent Transaction</h1>
                        <div className='bg-red-100 p-4 rounded-xl'>
                            <FaWallet color='red' size={20} />
                        </div>
                    </div>
                    <p className='text-4xl font-semibold'>&#8377;{"12345"}</p>
                </div> */}
            </div>

            <div className='flex gap-10'>
                <TextField label="Payer mobile no."
                    type='number'
                    onChange={(e) => {
                        setTimeout(() => {
                            setFilter(prev => ({ ...prev, 'payer.contact1': e.target.value }))
                        }, 300)
                    }}
                    className='w-full *:text-xl' />

                <TextField label="Receiver mobile no."
                    type='number'
                    onChange={(e) => {
                        setTimeout(() => {
                            setFilter(prev => ({ ...prev, 'receiver.contact1': e.target.value }))
                        }, 300)
                    }}
                    className='w-full *:text-xl' />

                <div className='flex gap-5'>
                    <FormControl fullWidth>
                        <TextField
                            label="Date From"
                            type='date'
                            value={moment(Number(filter.from) || Date.now()).format('YYYY-MM-DD')}
                            onChange={(e) => {
                                setFilter(prev => ({ ...prev, from: moment(e.target.value).valueOf().toString() }))
                            }}
                            className='w-full *:text-xl' />
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField
                            label="Date To"
                            type='date'
                            value={moment(Number(filter.to) || Date.now()).format('YYYY-MM-DD')}
                            onChange={(e) => {
                                setFilter(prev => ({ ...prev, to: moment(e.target.value).valueOf().toString() }))
                            }}
                            className='w-full *:text-xl' />
                    </FormControl>
                </div>

                <FormControl fullWidth>
                    <InputLabel id="Status" className='text-xl'>Status</InputLabel>
                    <Select label="Status" placeholder='Status' className='flex-1 *:text-xl' defaultValue='All' value={filter?.status} onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as "All" | "pending" | "completed" | "cancelled" }))}>
                        <MenuItem className='py-5' value="All">All</MenuItem>
                        <MenuItem className='py-5' value="pending">Pending</MenuItem>
                        <MenuItem className='py-5' value="completed">Completed</MenuItem>
                        <MenuItem className='py-5' value="cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <Paper>
                <DataGrid
                    sx={{
                        minHeight: 200,
                        height: '100%',
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

            <Modal open={show == 'Add balance'} setOpen={() => setShow('')} className='w-[40rem] max-w-full'>
                <AddTransactions setShowModal={() => setShow('')} />
            </Modal>

            <Modal open={show == 'Pay'} setOpen={() => setShow('')} className='w-[40rem] max-w-full'>
                <AddPay setShowModal={() => setShow('')} />
            </Modal>
        </div>
    )
}

const UserDetails = ({ params }: { params: GridRenderCellParams }) => {
    const [show, setShow] = useState(false)

    return (
        <div className='h-full flex items-center justify-center'>
            <Button className='flex gap-3 items-center justify-center' onClick={() => setShow(true)}>
                <p className='text-lg'>{params.row?.[params?.field]?.fullname}</p>
                <p className='text-lg'>({params.row?.[params?.field]?.userRole})</p>
            </Button>

            <Modal open={show} setOpen={setShow} className='w-[50rem] max-w-full'>
                <>
                    <div className="max-w-4xl mx-auto p-10 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center capitalize">{params.field} Data</h1>
                        <div className="border-0 border-gray-300 rounded-lg divide-y divide-gray-200 overflow-hidden">
                            {params.row?.[params?.field] && Object.entries(params.row?.[params?.field])
                                .filter(([key]) => ['fullname', 'email', 'userRole', 'contact1'].includes(key))
                                .map(([key, value], index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-10 bg-white hover:bg-indigo-50 transition-all"
                                    >
                                        <span className="text-gray-700 font-medium text-xl capitalize">
                                            {key}
                                        </span>
                                        <span className="text-gray-900 font-semibold text-xl">
                                            {value instanceof Date ? moment(new Date(value)).format('Do MMM YYYY') as string : value as string}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </>
            </Modal>
        </div>
    )
}

const BookingDetails = ({ params }: { params: GridRenderCellParams }) => {
    const [show, setShow] = useState(false)

    console.log(params.row.bookings)

    return (
        <div className='h-full flex items-center justify-center'>
            <Button className='flex gap-3 items-center justify-center' onClick={() => setShow(true)}>
                <p className='text-lg'>{params.row?.[params?.field]?._id}</p>
            </Button>

            <Modal open={show} setOpen={setShow} className='w-[50rem] max-w-full'>
                <>
                    <div className="max-w-4xl mx-auto p-10 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center capitalize">{params.field} Data</h1>
                        <div className="border-0 border-gray-300 rounded-lg divide-y divide-gray-200 overflow-hidden">
                            {params.row?.[params?.field] && Object.entries(params.row?.[params?.field]).filter(([key, value]) => typeof value == 'string').map(([key, value], index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-10 bg-white hover:bg-indigo-50 transition-all"
                                >
                                    <span className="text-gray-700 font-medium text-xl capitalize">
                                        {key}
                                    </span>
                                    <span className="text-gray-900 font-semibold text-xl">
                                        {moment(value as string).isValid() ? moment(new Date(value as string)).format('Do MMM YYYY') : value as string}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            </Modal>
        </div>
    )
}

export default Transaction