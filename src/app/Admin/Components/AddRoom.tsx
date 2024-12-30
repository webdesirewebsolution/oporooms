'use client'

import Button from '@/Components/Buttons'
import IconButton from '@/Components/IconButton'
import Input from '@/Components/Input'
import { HotelTypes } from '@/Types/Hotels'
import { RoomsTypes } from '@/Types/Rooms'
import { CircularProgress, Switch } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import Select from 'react-select'

type Props = {
    hotelData: HotelTypes,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    isEdit?: boolean,
    roomData?: RoomsTypes
}

type dataProps = {
    id: number, type: string, number: number, status: boolean
}

const initialData: dataProps[] = [
    {
        id: 0,
        number: 0,
        type: 'Select Room Type',
        status: true
    }
]

const AddRoom = ({ hotelData, setShowModal, isEdit, roomData }: Props) => {
    const router = useRouter()
    const [value, setValue] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue([roomData as dataProps])
        }
    }, [isEdit, roomData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (value?.length > 0 && value?.[0].type !== '') {
            setLoading(true)

            try {
                if (isEdit) {

                    const formData: RoomsTypes = value?.[0]

                    await axios.put(`/api/Rooms`, formData).then(r => {
                        if (r.status == 200) {
                            router.refresh()
                            setShowModal(false)
                        }
                    }).finally(() => setLoading(false))
                } else {

                    const formData: RoomsTypes[] = value?.map(({ id, ...item }) => ({
                        ...item, hotelId: hotelData?._id as string,
                        hotelOwnerId: hotelData?.hotelOwnerId as string
                    }))

                    await axios.post(`/api/Rooms`, formData).then(r => {
                        if (r.status == 200) {
                            setShowModal(false)
                        }
                    }).finally(() => setLoading(false))
                }
            } catch {
                setMsg('Room Already Exist')
            }

        }
    }


    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <p className='text-3xl mb-5 text-red-500 text-center'>Add Room</p>

            {msg !== '' && <p className='text-red-500 text-lg text-center'>{msg}</p>}

            <div className='flex flex-col gap-10'>
                {value.map((item, i) => (
                    <AddMoreRoom key={item.id} id={i} value={value} item={item} setValue={setValue} loading={loading} hotelData={hotelData} />
                ))}
            </div>


            {!isEdit && <Button type='button' className='border border-red-500 text-red-500 py-5 bg' variant='outlined' size='large' onClick={() => {
                setValue(prev => [...prev, {
                    id: value.length,
                    number: 0,
                    type: 'Select Room Type',
                    status: true
                }])
            }}>Add More Rooms</Button>}

            <Button type='submit' className='bg-red-400 text-white py-5' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : (isEdit ? 'Edit Room' : 'Add Room')}</Button>
        </form>
    )
}

type AddRoomProps = {
    item: dataProps,
    value: dataProps[],

    setValue: React.Dispatch<React.SetStateAction<dataProps[]>>

    loading: boolean,
    hotelData: HotelTypes,
    id: number
}

const AddMoreRoom = ({ item, value, setValue, loading, hotelData, id }: AddRoomProps) => {
    const onChange = (key: keyof RoomsTypes, val: string | number) => {
        setValue(prev => prev?.map((d) => d.id == item.id ? ({ ...d, [key]: val }) : d))
    }

    return (
        <div className='flex flex-col gap-10 shadow p-10 relative'>
            <p className='text-lg bg-red-400 w-fit px-5 text-white absolute -top-4 rounded-full'>Room - {id + 1}</p>
            <div className='flex gap-5'>
                <Input min={0} disabled={loading} label='Room Number' placeholder='Enter Rooom Number' type='number' value={item.number} onChange={(e) => onChange('number', e.target.value)} />

                <div className='flex flex-col gap-2'>
                    <p className='text-xl'>Select Room Type</p>
                    <Select
                        isDisabled={loading}
                        defaultValue={{ label: 'Select Room Type', value: 'Select Room Type' }}
                        options={hotelData?.rooms?.map((item) => ({ label: item.type, value: item?.type }))}
                        value={{ label: item.type, value: item.type }}
                        onChange={(e) => e && onChange('type', e.value)}
                    />
                </div>
            </div>

            <div className='flex items-center'>
                <p>Available: </p>
                <Switch defaultChecked value={item?.status} onClick={() => {
                    setValue(prev => prev?.map((d) => d.id == item.id ? ({ ...d, status: !item?.status }) : d))
                }} />
            </div>

            {value.length > 1 &&
                <div>
                    <IconButton disabled={loading} className='bg-red-500 absolute bottom-4 right-4' onClick={() => {
                        setValue(prev => prev?.filter(it => it.id !== item.id))
                    }}>
                        <MdDelete size={15} color='#fff' />
                    </IconButton>
                </div>}
        </div>
    )
}

export default AddRoom