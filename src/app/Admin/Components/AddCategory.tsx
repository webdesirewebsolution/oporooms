'use client'

import { CategoriesTypes, SubCategoryTypes } from '@/Types/Categories'
import { Button, CircularProgress, IconButton, TextField } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { IoClose } from 'react-icons/io5'
import { MdDelete } from 'react-icons/md'

type Props = {
    data?: CategoriesTypes,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    isEdit?: boolean,
}

const initialData: CategoriesTypes = {
    category: '',
    location: {
        placeId: '',
        lng: 0,
        lat: 0,
        city: 'Goa, India'
    },
    subCategories: []
}

const AddCategory = ({ data, setShowModal, isEdit }: Props) => {
    const router = useRouter()
    const [value, setValue] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue(data as CategoriesTypes)
        }
    }, [isEdit, data])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isEdit) {
                const formData: CategoriesTypes = value

                await axios.put(`/api/category`, formData).then(r => {
                    if (r.status == 200) {
                        router.refresh()
                        setShowModal(false)
                    }
                }).finally(() => setLoading(false))
            } else {

                const formData: CategoriesTypes = value

                await axios.post(`/api/category`, formData).then(r => {
                    if (r.status == 200) {
                        router.refresh()
                        setShowModal(false)
                    }
                }).finally(() => setLoading(false))
            }
        } catch {
            setLoading(false)
            setMsg('User Already Exist')
        }
    }

    console.log(value)

    return (
        <>
            <form onSubmit={handleSubmit} className='flex flex-col gap-10'>

                {msg !== '' && <p className='text-red-500 text-lg text-center'>{msg}</p>}

                <TextField id="outlined-basic" label="Title" variant="outlined"
                    value={value.category}
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, category: e.target.value }))}
                    required
                />

                <GooglePlacesAutocomplete
                    selectProps={{
                        placeholder: 'Select Address',
                        defaultValue: { label: value.location.city as string, value: value.location.city as string },
                        value: { label: value.location.city as string, value: value.location.city as string },
                        onChange: (e) => {

                            if (typeof window !== 'undefined') {
                                const geocoder = new google.maps.Geocoder()

                                geocoder.geocode({ 'placeId': e?.value?.place_id }, (results, status) => {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        const location = results?.[0]?.geometry?.location?.toJSON()

                                        setValue(prev => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                lat: location?.lat as number,
                                                lng: location?.lng as number,
                                                city: e?.value?.description,
                                                placeId: e?.value?.place_id
                                            }
                                        }))
                                    }
                                })
                            }

                        },
                        classNames: {
                            control: () => 'py-[0.7rem] mt-1 bg-gray-50 border-gray-100'
                        },
                    }}

                    apiOptions={{
                        id: 'GoogleMaps',
                        apiKey: 'AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U'
                    }}
                    apiKey="AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U"

                />

                {value?.subCategories?.map((item, i) => <SubCategories id={i} key={item.id} item={item} setValue={setValue} loading={loading} />)}


                <Button className='border-red-400 w-fit text-red-500' variant='outlined' size='large'
                    onClick={() =>
                        setValue(prev => ({
                            ...prev,
                            subCategories: [...prev.subCategories, {
                                id: value?.subCategories?.length,
                                title: '',
                                location: {
                                    placeId: '',
                                    lng: 0,
                                    lat: 0,
                                    city: 'Goa, India'
                                }
                            }]
                        })
                        )}
                > + Add Subcategories</Button>

                <Button type='submit' className='bg-blue-500 text-white py-5' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : (isEdit ? 'Edit Category' : 'Add Category')}</Button>

            </form>

        </>
    )
}

type RoomTypeProps = {
    id: number,
    item: SubCategoryTypes,
    setValue: React.Dispatch<React.SetStateAction<CategoriesTypes>>,
    loading: boolean
}

const SubCategories = ({ id, item, setValue, loading }: RoomTypeProps) => {
    const onChange = (key: keyof SubCategoryTypes, val: string | number) => {
        setValue(prev => ({ ...prev, subCategories: prev.subCategories?.map((d) => d.id == item.id ? ({ ...d, [key]: val }) : d) }))
    }

    return (
        <div className='relative flex flex-col gap-10 border-slate-200 p-10 border-2 shadow rounded-lg'>
            <p className='text-lg bg-red-400 w-fit px-5 text-white absolute -top-4 rounded-full'>Subcategory -
                {" "}{id + 1}</p>
            <div className='flex flex-col gap-5'>

                <TextField id="room_type"
                    label="Sub Category"
                    variant="outlined"
                    disabled={loading}
                    value={item.title}
                    className='*:text-xl z-0'
                    onChange={e => onChange('title', e.target.value)}
                    required
                />

                <GooglePlacesAutocomplete
                    selectProps={{
                        placeholder: 'Select Address',
                        defaultValue: { label: item.location.city as string, value: item.location.city as string },
                        value: { label: item.location.city as string, value: item.location.city as string },
                        onChange: (e) => {

                            if (typeof window !== 'undefined') {
                                const geocoder = new google.maps.Geocoder()

                                geocoder.geocode({ 'placeId': e?.value?.place_id }, (results, status) => {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        const location = results?.[0]?.geometry?.location?.toJSON()

                                        setValue(prev => ({
                                            ...prev,
                                            subCategories: prev.subCategories?.map((d) => d.id == item.id ? ({
                                                ...d,
                                                location: {
                                                    lat: location?.lat as number,
                                                    lng: location?.lng as number,
                                                    city: e?.value?.description,
                                                    placeId: e?.value?.place_id
                                                }
                                            }) : d)
                                        }))
                                    }
                                })
                            }

                        },
                        classNames: {
                            control: () => 'py-[0.7rem] mt-1 bg-gray-50 border-gray-100'
                        },
                    }}

                    apiOptions={{
                        id: 'GoogleMaps',
                        apiKey: 'AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U'
                    }}
                    apiKey="AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U"

                />


                <IconButton disabled={loading} className='bg-red-500 absolute -top-5 -right-4' onClick={() => {
                    setValue(prev => ({ ...prev, subCategories: prev?.subCategories?.filter(it => it.id !== item.id) }))
                }}>
                    <IoClose size={10} color='#fff' />
                </IconButton>
            </div>
        </div>
    )
}

export default AddCategory