'use client'

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import { TypeSafeColDef } from '@/Types/DataGridTypes'
import Image from 'next/image'
import moment from 'moment'
import { Context } from '@/Context/context'
import { User } from '@/Types/Profile'
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
    const [searchParams, setSearchParams] = useState<{ [key: string]: string }>({})
    const [searchParamsLoading, setSearchParamsLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        setSearchParamsLoading(true)
        switch (user.userRole) {
            case 'CADMIN':
                setSearchParams(prev => ({ ...prev, 'companyId': user._id as string }))
                setSearchParamsLoading(false)
                break;

            case 'HR':
                setSearchParams(prev => ({ ...prev, 'companyId': user.companyId as string }))
                setSearchParamsLoading(false)
                break;

            default:
                setSearchParamsLoading(false)
                break;
        }
    }, [user])

    useEffect(() => {
        (async () => {
            setLoading(true)
            if (user?._id && !searchParamsLoading) {
                await axios.get(`/api/Users?page=${filter.page}&pageSize=${filter?.pageSize}&${Object.keys(searchParams)?.[0]}=${Object.values(searchParams)?.[0]}`).then(r => {
                    if (r.status == 200) {
                        console.log(r.data?.list)
                        setData(r.data?.list)
                        setCount(r.data?.count)
                    }
                }).finally(() => setLoading(false))
            }
        })()
    }, [filter, user, searchParams, searchParamsLoading])


    const columns: TypeSafeColDef<User>[] = [
        { id: 0, field: '_id', headerName: 'Id' },
        { id: 0, field: 'userRole', headerName: 'User Role' },
        { id: 1, field: 'photo', headerName: 'Photo', renderCell: (params) => <Photos params={params} /> },
        { id: 2, field: 'fullname', headerName: 'Name', },
        { id: 4, field: 'email', headerName: 'Email' },
        { id: 4, field: 'gender', headerName: 'Gender' },
        { id: 4, field: 'username', headerName: 'Username' },
        { id: 4, field: 'contact1', headerName: 'Contact1' },
        { id: 4, field: 'contact2', headerName: 'Contact2' },
        { id: 3, field: 'dob', headerName: 'Date', valueGetter: (value) => moment(value).format('Do, MMMM, YYYY') },
    ]

    columns.forEach((item) => {
        item.align = 'center';
        item.headerAlign = 'center'
    })

    return (
        <div className='flex flex-col gap-10'>
            {(user?.userRole == 'SADMIN' || user?.userRole == 'CADMIN' || user?.userRole == 'HR') && <div>
                <Button onClick={() => setShowForm(true)} className='bg-red-500 text-white'>
                    Add User
                </Button>
            </div>}

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

export default Users