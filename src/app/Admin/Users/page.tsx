'use client'

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import { TypeSafeColDef } from '@/Types/DataGridTypes'
import Image from 'next/image'
import moment from 'moment'
import { Context } from '@/Context/context'
import { User, UserAction } from '@/Types/Profile'
import { Avatar, Button, Paper } from '@mui/material'
import Modal from '@/Components/Modal'
import AddUser from '../Components/AddUser'

const Users = () => {
    const { user } = useContext(Context)
    const [data, setData] = useState<User[]>([])
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        pageSize: 10
    })
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            if (user?.userRole !== '') {
                await axios.get(`/api/Users?page=${filter.page * 10}&pageSize=${filter?.pageSize}`).then(r => {
                    if (r.status == 200) {
                        setData(r.data?.list)
                        setCount(r.data?.count)
                    }
                }).finally(() => setLoading(false))
            }
        })()
    }, [filter, user])


    const columns: TypeSafeColDef<UserAction>[] = [
        { id: 0, field: '_id', headerName: 'Id' },
        { id: 1, field: 'userRole', headerName: 'User Role' },
        { id: 2, field: 'photo', headerName: 'Photo', renderCell: (params) => <Photos params={params} /> },
        { id: 3, field: 'fullname', headerName: 'Name', },
        { id: 4, field: 'email', headerName: 'Email' },
        { id: 5, field: 'gender', headerName: 'Gender' },
        { id: 6, field: 'username', headerName: 'Username' },
        { id: 7, field: 'contact1', headerName: 'Contact1' },
        { id: 8, field: 'contact2', headerName: 'Contact2' },
        { id: 9, field: 'dob', headerName: 'Date', valueGetter: (value) => moment(value).format('Do, MMMM, YYYY') },
        { id: 10, field: 'actions', headerName: 'Action', renderCell: (params) => <Action params={params} /> },
    ]

    columns.forEach((item) => {
        item.align = 'center';
        item.headerAlign = 'center'
    })

    return (
        <div className='flex flex-col gap-10'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-semibold'>Users</h1>
                {(user?.userRole == 'SADMIN' || user?.userRole == 'CADMIN' || user?.userRole == 'HR') &&
                    <Button onClick={() => setShowForm(true)} className='bg-red-500 text-white'>
                        Add User
                    </Button>
                }
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

            <Modal open={showForm} setOpen={setShowForm} className='overflow-y-auto w-[50rem] max-w-full'>
                <AddUser userData={user} setShowModal={setShowForm} />
            </Modal>
        </div>
    )
}

const Photos = ({ params }: { params: GridRenderCellParams }) => {
    return (
        <div className='overflow-hidden flex items-center justify-center h-full'>
            <Avatar alt=''>
                {params?.row?.photo &&
                    <Image src={params?.row?.photo} className='object-cover' alt={params?.row?.fullname} fill />}
            </Avatar>
        </div>
    )
}

const Action = ({ params }: { params: GridRenderCellParams }) => {
    const [showEdit, setShowEdit] = useState(false)
    return (
        <div>
            <Button onClick={() => setShowEdit(true)} className='bg-red-400 text-white'>
                Edit User
            </Button>

            <Modal open={showEdit} setOpen={setShowEdit}>
                <AddUser userData={params?.row} setShowModal={setShowEdit} isEdit={true} />
            </Modal>
        </div>
    )
}

export default Users