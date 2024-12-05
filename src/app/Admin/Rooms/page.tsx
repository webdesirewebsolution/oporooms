'use client'

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import { TypeSafeColDef } from '@/Types/DataGridTypes'
import Image from 'next/image'
import { Context } from '@/Context/context'
import { Avatar, Button, Paper } from '@mui/material'
import { RoomActions, RoomsTypes } from '@/Types/Rooms'
import Modal from '@/Components/Modal'
import AddRoom from '../Components/AddRoom'
import { FaCheck } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

const Rooms = () => {
    const { user } = useContext(Context)
    const [data, setData] = useState<RoomsTypes[]>([])
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
                const params = new URLSearchParams();

                await axios.get(`/api/Rooms?page=${filter.page * 10}&pageSize=${filter?.pageSize}&${params.toString()}`).then(r => {
                    if (r.status == 200) {
                        setData(r.data?.list)
                        setCount(r.data?.count)
                    }
                }).finally(() => setLoading(false))
            }
        })()
    }, [filter, user])

    const columns: TypeSafeColDef<RoomActions>[] = [
        // { id: 0, field: '_id', headerName: 'Id' },
        { id: 1, field: 'number', headerName: 'Number' },
        {
            id: 2, field: 'BookingsData', headerName: 'Room Assigned', width: 130, renderCell: (params) => {
                return (
                    <div className='flex h-full items-center justify-center'>
                        {params?.row?.BookingsData?.length ? (<FaCheck color='green' />) : (<><IoMdClose color='red' /></>)}
                    </div>
                )
            }
        },
        { id: 3, field: 'type', headerName: 'Type', },
        {
            id: 3, field: 'status', headerName: 'Status', minWidth: 150, renderCell: (params) => {
                return (
                    <div className='flex h-full items-center justify-center'>
                        {params?.row?.status ? 'Available' : 'Not Available' }
                    </div>
                )
            }
        },
        { id: 4, field: 'actions', headerName: 'Actions', minWidth: 180, renderCell: (params) => <Actions params={params} setData={setData} /> },
    ]

    columns.forEach((item) => {
        item.align = 'center';
        item.headerAlign = 'center'
    })

    return (
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
    )
}

const Photos = ({ params }: { params: GridRenderCellParams }) => {
    return (
        <div className='overflow-hidden flex items-center justify-center h-full'>
            <Avatar alt=''>
                {params?.row?.photos?.length > 0 &&
                    <Image src={params?.row?.photos?.[0]} className='object-cover' alt={params?.row?.type} fill />}
            </Avatar>
        </div>
    )
}

const Actions = ({ params, setData }: { params: GridRenderCellParams, setData: React.Dispatch<React.SetStateAction<RoomsTypes[]>> }) => {
    const [showModal, setShowModal] = useState(false)
    const [showEdit, setShowEdit] = useState(false)

    const handleDelete = async () => {
        await axios.delete(`/api/Rooms?_id=${params?.row?._id}`).then((r) => {
            if (r.status == 200) {
                setData(prev => prev?.filter(i => i?._id !== params?.row?._id))
                setShowModal(false)
            }
        })
    }

    return (
        <div className='flex h-full items-center justify-center gap-5'>
            <Button onClick={() => setShowEdit(true)} className='bg-blue-500 text-white'>Edit Room</Button>
            <Button disabled={params?.row?.BookingsData?.length > 0} className={params?.row?.BookingsData?.length > 0 ? 'bg-red-300 text-white' : 'bg-red-500 text-white'} onClick={() => setShowModal(true)}>Delete Room</Button>

            <Modal open={showModal} setOpen={() => setShowModal(false)}>
                <div className='flex flex-col gap-5 text-center'>
                    <p className='text-3xl'>Are you sure?</p>
                    <div className='flex gap-10'>
                        <Button className='bg-slate-600 text-white' size='large' onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button className='bg-red-600 text-white' size='large' onClick={handleDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>

            <Modal open={showEdit} setOpen={() => setShowEdit(false)} className='overflow-y-visible'>
                <AddRoom isEdit={true} roomData={params?.row} setShowModal={setShowEdit} hotelData={params?.row?.HotelData?.[0]} />
            </Modal>
        </div>
    )
}

export default Rooms