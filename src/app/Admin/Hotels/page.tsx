'use client'

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import { TypeSafeColDef } from '@/Types/DataGridTypes'
import Image from 'next/image'
import { Context } from '@/Context/context'
import { Avatar, Button, Paper } from '@mui/material'
import { AddressTypes, HotelActions, HotelTypes } from '@/Types/Hotels'
import Modal from '@/Components/Modal'
import { RoomVarietyTypes } from '@/Types/Rooms'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import AddRoom from '../Components/AddRoom'
import AddHotel from '../Components/AddHotel'

const Hotels = () => {
    const { user } = useContext(Context)
    const [data, setData] = useState<HotelTypes[]>([])
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        pageSize: 10
    })
    const [searchParams, setSearchParams] = useState<{ [key: string]: string }>({})
    const [searchParamsLoading, setSearchParamsLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showHotelForm, setShowHotelForm] = useState(false)

    useEffect(() => {
        setSearchParamsLoading(true)
        switch (user.userRole) {
            case 'HotelOwner':
                setSearchParams(prev => ({ ...prev, 'hotelOwnerId': user._id as string }))
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
                await axios.get(`/api/Hotels?page=${filter.page}&pageSize=${filter?.pageSize}&${Object.keys(searchParams)?.[0]}=${Object.values(searchParams)?.[0]}`).then(r => {
                    if (r.status == 200) {
                        console.log(r.data?.list)
                        setData(r.data?.list)
                        setCount(r.data?.count)
                    }
                }).finally(() => setLoading(false))
            }
        })()
    }, [filter, user, searchParams, searchParamsLoading])


    const columns: TypeSafeColDef<HotelActions>[] = [
        { id: 0, field: '_id', headerName: 'Id' },
        { id: 1, field: 'photos', headerName: 'Photo', renderCell: (params) => <Photos params={params} /> },
        { id: 2, field: 'name', headerName: 'Name', },
        { id: 3, field: 'address', headerName: 'Address', minWidth: 110, renderCell: (params) => <Address params={params} /> },
        { id: 4, field: 'rooms', headerName: 'Room Types', minWidth: 150, renderCell: (params) => <RoomTypes params={params} /> },
        { id: 5, field: 'status', headerName: 'Status' },
        { id: 6, field: 'amenities', headerName: 'View Amenities', renderCell: (params) => <Amenities params={params} /> },
        { id: 7, field: 'hotelActions', headerName: 'Actions', minWidth: 180, renderCell: (params) => <Actions params={params} setData={setData} /> },
        { id: 7, field: 'roomActions', headerName: 'Room Actions', minWidth: 150, renderCell: (params) => <RoomActions params={params} /> },
    ]

    columns.forEach((item) => {
        item.align = 'center';
        item.headerAlign = 'center'
    })

    return (
        <div className='flex flex-col gap-10'>
            {user?.userRole == 'HotelOwner' && <div>
                <Button onClick={() => setShowHotelForm(true)} className='bg-red-500 text-white'>Add Hotel</Button>
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
                    paginationMode="server"
                    paginationModel={{
                        page: Number(filter.page),
                        pageSize: Number(filter.pageSize)
                    }}
                    onPaginationModelChange={setFilter}
                />
            </Paper>

            <Modal open={showHotelForm} setOpen={setShowHotelForm} className='overflow-y-auto'>
                <AddHotel hotelOwnerData={user} setShowModal={setShowHotelForm} />
            </Modal>
        </div>
    )
}

const Photos = ({ params }: { params: GridRenderCellParams }) => {
    return (
        <div className='overflow-hidden flex items-center justify-center h-full'>
            <Avatar alt=''>
                {params?.row?.photos?.length > 0 &&
                    <Image src={params?.row?.photos?.[0]} className='object-cover' alt={params?.row?.fullname} fill />}
            </Avatar>
        </div>
    )
}

const Address = ({ params }: { params: GridRenderCellParams }) => {
    const [showAddr, setShowAddr] = useState(false)
    return (
        <>
            <Button onClick={() => setShowAddr(true)}>View Address</Button>

            <Modal open={showAddr} setOpen={() => setShowAddr(false)}>
                <div className='flex flex-col gap-5 border shadow p-10 rounded-lg'>
                    {Object.entries(params?.row?.address as AddressTypes)?.map((item, i) => (
                        <div key={i} className='flex gap-20 justify-between items-center'>
                            <div className='capitalize'>{item?.[0]}:</div>
                            <div>{item?.[1]}</div>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    )
}

const RoomTypes = ({ params }: { params: GridRenderCellParams }) => {
    const [showRoomTypes, setShowRoomTypes] = useState(false)
    return (
        <>
            <Button onClick={() => setShowRoomTypes(true)}>Show Room Types</Button>

            <Modal open={showRoomTypes} setOpen={() => setShowRoomTypes(false)}>
                <div>
                    <p className='text-3xl font-semibold'>Types of Rooms</p>
                    <div className='flex flex-col gap-10 overflow-y-scroll p-10'>
                        {params?.row?.rooms?.map((item: RoomVarietyTypes) => (
                            <div key={item?.id} className='flex gap-5 border shadow p-5 rounded-lg'>
                                {item?.photos?.[0]?.length > 0 &&
                                    <Swiper slidesPerView={1} spaceBetween={10} className='w-80'
                                        modules={[Pagination]}
                                        pagination>
                                        {item?.photos?.map((img) => (
                                            <SwiperSlide key={img} className='!w-fit'>
                                                <Image src={item?.photos?.[0]} alt='' width={200} height={100} objectFit='cover' className='rounded-lg aspect-video' />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                }

                                <div className='flex flex-col'>
                                    <p className='font-bold'>{item?.type}</p>
                                    <p className='text-2xl'>Rs.{item?.price}</p>
                                    <p className='text-lg text-slate-600'>Taxes and Fee: Rs.{item?.fee}</p>
                                    <Swiper className='w-96 py-5 pr-5' slidesPerView='auto' spaceBetween={10}>
                                        {item?.amenities?.map((am) => (
                                            <SwiperSlide key={am} className='!w-fit'>
                                                <div className='text-lg text-nowrap shadow bg-white p-2 rounded-lg'>
                                                    {am}
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    )
}

const Amenities = ({ params }: { params: GridRenderCellParams }) => {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <Button onClick={() => setShowModal(true)}>View Amenities</Button>

            <Modal open={showModal} setOpen={() => setShowModal(false)}>
                <div className='flex flex-wrap gap-5 w-96 overflow-y-auto'>
                    {params?.row?.amenities?.map((item: string) => (
                        <div key={item} className='shadow px-3 py-2 text-lg rounded-lg border'>
                            {item}
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    )
}

const Actions = ({ params, setData }: { params: GridRenderCellParams, setData: React.Dispatch<React.SetStateAction<HotelTypes[]>> }) => {
    const [showModal, setShowModal] = useState(false)
    const [showEdit, setShowEdit] = useState(false)

    const handleDelete = async () => {
        await axios.delete(`/api/Hotels?_id=${params?.row?._id}`).then((r) => {
            if (r.status == 200) {
                setData(prev => prev?.filter(i => i?._id !== params?.row?._id))
                setShowModal(false)
            }
        })
    }

    return (
        <>
            <Button onClick={() => setShowEdit(true)}>Edit Hotel</Button>
            <Button className='text-red-500' onClick={() => setShowModal(true)}>Delete Hotel</Button>

            <Modal open={showModal} setOpen={() => setShowModal(false)}>
                <div className='flex flex-col gap-5 text-center'>
                    <p className='text-3xl'>Are you sure?</p>
                    <div className='flex gap-10'>
                        <Button className='bg-slate-600 text-white' size='large' onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button className='bg-red-600 text-white' size='large' onClick={handleDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>

            <Modal open={showEdit} setOpen={() => setShowEdit(false)}>
                <AddHotel hotelOwnerData={{
                    _id: params?.row?.hotelOwnerId
                }} setShowModal={setShowEdit} isEdit={true} hotelData={params?.row} />
            </Modal>
        </>
    )
}

const RoomActions = ({ params }: { params: GridRenderCellParams }) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <Button onClick={() => setShowModal(true)}>Add Rooms</Button>

            <Modal open={showModal} setOpen={() => setShowModal(false)} className='overflow-y-visible'>
                <AddRoom hotelData={params?.row} setShowModal={setShowModal} />
            </Modal>
        </>
    )
}

export default Hotels