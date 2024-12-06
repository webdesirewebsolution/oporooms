'use client'

import { AssignedRooms, BookingFields, Bookings } from '@/Types/Booking'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import { TypeSafeColDef } from '@/Types/DataGridTypes'
import { Button, Checkbox, Skeleton, CircularProgress } from '@mui/material'
import Image from 'next/image'
import moment from 'moment'
import Modal from '@/Components/Modal'
import { Context } from '@/Context/context'
import { RoomsTypes } from '@/Types/Rooms'
import ReactSelect from 'react-select'
import { compareArray } from '@/Functions'

const Home = () => {
  const { user } = useContext(Context)
  const [data, setData] = useState<Bookings[]>([])
  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10
  })

  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)

      if (user.userRole !== '') {
        await axios.get(`/api/bookings?page=${filter.page * 10}&pageSize=${filter?.pageSize}`).then(r => {
          if (r.status == 200) {
            setData(r.data?.list)
            setCount(r.data?.count)
          }
        }).finally(() => setLoading(false))
      }
    })()
  }, [filter, user])


  const columns: TypeSafeColDef<BookingFields>[] = [
    { id: 0, field: '_id', headerName: 'Id' },
    { id: 0, field: 'bookingUid', headerName: 'Booking UID' },
    // { id: 1, field: 'photos', headerName: 'Photo', renderCell: (params) => <Photos params={params} /> },
    { id: 1, field: 'bookingDate', headerName: 'Date', valueGetter: (value) => moment(value).format('Do, MMMM, YYYY') },
    { id: 2, field: 'bookingType', headerName: 'Type', },
    { id: 3, field: 'status', headerName: 'Status', renderCell: (params) => <Status params={params} /> },
    { id: 4, field: 'assignedRooms', headerName: 'Assigned Rooms', renderCell: (params) => params?.row?.assignedRooms?.length },
    { id: 5, field: 'paymentMode', headerName: 'Payment Mode' },
    { id: 6, field: 'roomType', headerName: 'Room Type', renderCell: (params) => params?.row?.roomType },
    { id: 7, field: 'viewRooms', headerName: 'View', renderCell: (params) => <ViewRooms params={params} /> },
    { id: 8, field: 'actions', headerName: 'Actions', minWidth: 400, renderCell: (params) => <Actions params={params} setBookingData={setData} /> },
  ]

  columns.forEach((item) => {
    item.align = 'center';
    item.headerAlign = 'center'
  })

  return (
    <div>
      <DataGrid
        sx={{
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
    </div>
  )
}

const Status = ({ params }: { params: GridRenderCellParams }) => {

  const buttons = [{
    label: 'Approve',
    value: 'approved',
    className: 'bg-green-500',
  },
  {
    label: 'Pending',
    value: 'pending',
    className: 'bg-yellow-500',
  },
  {
    label: 'Reject',
    value: 'Rejected',
    className: 'bg-red-500',
  }]?.find(i => i.value == params?.row?.status)

  return (
    <div className='flex items-center justify-center h-full gap-3'>
      <div className={`${buttons?.className} size-3 rounded-full`} />
      {buttons?.label}
    </div>
  )
}

// const Photos = ({ params }: { params: GridRenderCellParams }) => {
//   return (
//     <div className='overflow-hidden flex items-center justify-center h-full'>
//       <Avatar alt=''>
//         {params?.row?.photos?.length > 0 &&
//           <Image src={params?.row?.photos?.[0]} className='object-cover' alt={params?.row?.fullname} fill />}
//       </Avatar>
//     </div>
//   )
// }

const ViewRooms = ({ params }: { params: GridRenderCellParams }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button className='bg-blue-500 text-white' onClick={() => setOpen(true)}>View Rooms</Button>

      <Modal open={open} setOpen={setOpen}>
        <div>
          <p className='text-3xl font-bold mb-10'>Assigned Rooms</p>
          <div className='border-b'>
            {params?.row?.assignedRooms?.map((item: AssignedRooms) => (
              <div key={item?._id} className='flex p-5 border-t gap-5'>
                <div className='bg-red-500 size-24 relative rounded-xl overflow-hidden'>
                  <Image src={item?.photos?.[0]} alt='' fill objectFit='cover' />
                </div>
                <ul>
                  <li className='flex gap-2'>
                    <span className='font-bold'>Room Number:</span>
                    <span>{item?.number}</span>
                  </li>
                  <li className='flex gap-2'>
                    <span className='font-bold'>Type:</span>
                    <span>{item?.type}</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}

const Actions = ({ params, setBookingData }: { params: GridRenderCellParams, setBookingData: React.Dispatch<React.SetStateAction<Bookings[]>> }) => {
  const { user } = useContext(Context)
  const [openAssign, setOpenAssign] = useState(false)
  const [openStatus, setOpenStatus] = useState(false)
  const [openBookingStatus, setOpenBookingStatus] = useState(false)

  return (
    <div className='flex items-center justify-center h-full gap-5'>
      {(user?.userRole == 'HotelOwner' || user?.userRole == 'SADMIN') && params?.row?.bookingStatus == 'approved' &&
        <>
          <Button className='bg-blue-500 text-white' onClick={() => setOpenAssign(true)}>Assign Rooms</Button>
          <Button className='bg-blue-500 text-white' onClick={() => setOpenStatus(true)}>Change Status</Button>
        </>
      }

      {(user?.userRole == 'HR' || user?.userRole == 'CADMIN' || user?.userRole == 'SADMIN') && params.row?.status != 'approved' && <Button className='bg-blue-500 text-white' onClick={() => setOpenBookingStatus(true)}>Booking Raise Status</Button>}

      <Modal open={openAssign} setOpen={setOpenAssign} className='w-6/12 max-w-full'>
        <AssignRooms params={params} setBookingData={setBookingData} />
      </Modal>

      <Modal open={openStatus} setOpen={setOpenStatus} className='w-6/12 max-w-full overflow-y-visible'>
        <UpdateStatus params={params} setBookingData={setBookingData} />
      </Modal>

      <Modal open={openBookingStatus} setOpen={setOpenBookingStatus} className='w-6/12 max-w-full overflow-y-visible'>
        <UpdateBookingStatus params={params} setBookingData={setBookingData} />
      </Modal>
    </div>
  )
}

const AssignRooms = ({ params, setBookingData }: { params: GridRenderCellParams, setBookingData: React.Dispatch<React.SetStateAction<Bookings[]>> }) => {
  const [data, setData] = useState<RoomsTypes[]>([])
  const [count, setCount] = useState(0)
  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 5,
  })
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedRooms, setSelectecRooms] = useState<AssignedRooms[]>([])

  useEffect(() => {
    setSelectecRooms(params.row.assignedRooms)
  }, [params.row])

  useEffect(() => {
    (async () => {
      setLoading(true)
      await axios.get(`/api/Rooms?hotelId=${params?.row?.details?._id}&type=${params.row?.roomType}&page=${filter.page}&pageSize=${filter.pageSize}`).then(r => {
        if (r.status == 200) {
          setData(r.data?.list)
          setCount(r.data?.count)
        }
      }).finally(() => setLoading(false))

    })()
  }, [params.row, filter])

  const handleSelectRooms = (item: AssignedRooms, selectedRoomId: number) => {
    if (item.number == selectedRoomId) setSelectecRooms(prev => prev.filter(i => i._id !== item._id))
    else {
      setSelectecRooms(prev => [...prev, {
        _id: item?._id,
        number: item?.number,
        photos: item?.photos,
        type: item?.type
      }])
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col gap-8'>
        {Array(2)?.fill(2, 0, 2)?.map((it, i) => (
          <div key={i} className='flex justify-between items-center'>
            <div className='flex gap-10'>
              <Skeleton variant='rounded' height={100} width={100} />
              <div className='gap-5'>
                <Skeleton variant='text' width={100} />
                <Skeleton variant='text' width={100} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const handleUpdate = async () => {
    if (selectedRooms?.length > 0) {
      setSubmitLoading(true)
      await axios.put(`/api/bookings`, {
        _id: params.row?._id,
        assignedRooms: selectedRooms,
        status: 'approved'
      }).then(r => {
        if (r.status == 200) {
          setBookingData((prev) => prev?.map((item) => item._id == params.row?._id ? ({ ...item, assignedRooms: selectedRooms, status: 'approved' }) : item))
        }
      }).finally(() => setSubmitLoading(false))
    }
  }

  return (
    <div className='flex flex-col gap-8'>

      <p className='text-3xl font-semibold' >Selected Rooms</p>
      {selectedRooms?.length > 0 ? selectedRooms?.map((item) => {
        const selected = selectedRooms?.find(i => i?._id == item?._id)

        return (
          <div key={item?._id} className='flex justify-between items-center'>
            <div className='flex gap-10'>
              <Image src={item?.photos?.[0]} alt='' width={100} height={100} objectFit='cover' className='rounded-md w-48 object-cover aspect-video' />
              <div>
                <p className='font-semibold'>{item?.type}</p>
                <p>{item.number}</p>
              </div>
            </div>
            <div>
              <Checkbox disabled={submitLoading || (Number(params.row?.roomDetails?.rooms) <= selectedRooms?.length && item.number !== selected?.number) ? true : false} value={item._id} onClick={() => handleSelectRooms(item, selected?.number as number)}
                checked={item?.number == selected?.number}
                size='large'
              />
            </div>
          </div>
        )
      }) : <p>No rooms selected</p>}
      <hr />

      <p className='text-3xl font-semibold' >Other Rooms</p>

      {data?.length > 0 ? data?.filter(i => selectedRooms?.find(j => j?._id == i?._id)?._id != i?._id).map((item) => {
        const selected = selectedRooms?.find(i => i?._id == item?._id)

        return (
          <div key={item?._id} className='flex justify-between items-center'>
            <div className='flex gap-10'>
              <Image src={item?.photos?.[0] as string} alt='' width={100} height={100} objectFit='cover' className='rounded-md w-48 object-cover aspect-video' />
              <div>
                <p className='font-semibold'>{item?.type}</p>
                <p>{item.number}</p>
              </div>
            </div>
            <div>
              <Checkbox disabled={submitLoading || (Number(params.row?.roomDetails?.rooms) <= selectedRooms?.length && item.number !== selected?.number) ? true : false} value={item._id} onClick={() => handleSelectRooms(item as AssignedRooms, selected?.number as number)}
                checked={item?.number == selected?.number}
                size='large'
              />
            </div>
          </div>
        )
      }) : <p>No rooms</p>}

      <div className='flex gap-5'>
        <Button disabled={filter.page == 0} className={`${filter.page == 0 ? 'bg-blue-300' : 'bg-blue-500'} text-white`} onClick={() => setFilter(prev => ({ ...prev, page: prev.page - 1 }))}>Prev</Button>
        <Button disabled={(filter.page + 1) * filter.pageSize >= count} className={`${(filter.page + 1) * filter.pageSize >= count ? 'bg-blue-300' : 'bg-blue-500'}  text-white`}
          onClick={() => setFilter(prev => ({ ...prev, page: prev.page + 1 }))}
        >Next</Button>
      </div>

      <Button onClick={() => handleUpdate()} disabled={submitLoading || compareArray(params.row?.assignedRooms, selectedRooms, '_id')} className={`${submitLoading || compareArray(params.row?.assignedRooms, selectedRooms, '_id') ? 'bg-blue-300' : 'bg-blue-500'} text-white w-fit px-16 py-5`} size='large'>{submitLoading ? <CircularProgress size={15} color='inherit' /> : "Assign Room"}</Button>
    </div>
  )
}

const UpdateStatus = ({ params, setBookingData }: { params: GridRenderCellParams, setBookingData: React.Dispatch<React.SetStateAction<Bookings[]>> }) => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [value, setValue] = useState({ label: params.row?.status, value: params.row?.status })

  useEffect(() => {
    setValue({ label: params.row?.status?.toUpperCase(), value: params.row?.status })
  }, [params.row])

  const options = ["approved", "pending", "cancel request", "cancelled"]

  const handleUpdate = async () => {
    if (params.row?.status != value?.value) {
      setSubmitLoading(true)
      await axios.put(`/api/bookings`, {
        _id: params.row?._id,
        status: value?.value
      }).then(r => {
        if (r.status == 200) {
          setBookingData((prev) => prev?.map((item) => item._id == params.row?._id ? ({ ...item, status: value?.value }) : item))
        }
      }).finally(() => setSubmitLoading(false))
    }
  }

  return (
    <div className='flex flex-col gap-5'>
      <p className='text-3xl font-semibold'>Change Status</p>
      <ReactSelect
        isDisabled={submitLoading}
        value={value}
        options={options?.map((item) => ({ label: item.toUpperCase(), value: item }))}
        onChange={(e) => e && setValue({ label: e?.label, value: e?.value })}
      />
      <Button onClick={handleUpdate} disabled={params.row?.status == value?.value || submitLoading} className={`w-fit ${(params.row?.status == value?.value || submitLoading) ? 'bg-blue-300' : 'bg-blue-500'} text-white px-12 py-5`}>
        {submitLoading ? <CircularProgress size={15} color='inherit' /> : "Submit"}
      </Button>
    </div>
  )
}

const UpdateBookingStatus = ({ params, setBookingData }: { params: GridRenderCellParams, setBookingData: React.Dispatch<React.SetStateAction<Bookings[]>> }) => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [value, setValue] = useState({ label: params.row?.bookingStatus, value: params.row?.bookingStatus })

  useEffect(() => {
    setValue({ label: params.row?.bookingStatus?.toUpperCase(), value: params.row?.bookingStatus })
  }, [params.row])

  const options = ["approved", "pending", "declined"]

  const handleUpdate = async () => {
    if (params.row?.status != value?.value) {
      setSubmitLoading(true)
      await axios.put(`/api/bookings`, {
        _id: params.row?._id,
        bookingStatus: value?.value
      }).then(r => {
        if (r.status == 200) {
          setBookingData((prev) => prev?.map((item) => item._id == params.row?._id ? ({ ...item, bookingStatus: value?.value }) : item))
        }
      }).finally(() => setSubmitLoading(false))
    }
  }

  return (
    <div className='flex flex-col gap-5'>
      <p className='text-3xl font-semibold'>Change Booking Status</p>
      <ReactSelect
        isDisabled={submitLoading}
        value={value}
        options={options?.map((item) => ({ label: item.toUpperCase(), value: item }))}
        onChange={(e) => e && setValue({ label: e?.label, value: e?.value })}
      />
      <Button onClick={handleUpdate} disabled={params.row?.bookingStatus == value?.value || submitLoading} className={`w-fit ${(params.row?.bookingStatus == value?.value || submitLoading) ? 'bg-blue-300' : 'bg-blue-500'} text-white px-12 py-5`}>
        {submitLoading ? <CircularProgress size={15} color='inherit' /> : "Submit"}
      </Button>
    </div>
  )
}


export default Home