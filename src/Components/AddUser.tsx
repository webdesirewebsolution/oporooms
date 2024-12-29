'use client'

import Upload from '@/Components/Upload'
import cloudinaryImageUploadMethod from '@/Functions/cloudinary'
import { User } from '@/Types/Profile'
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import axios, { AxiosError } from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { MuiTelInput } from 'mui-tel-input'
import { useRouter } from 'next/navigation'
import OtpInput from 'react-otp-input';
import { signIn } from 'next-auth/react'
import dayjs from 'dayjs'

type Props = {
    userData?: User,
    setShowModal: React.Dispatch<React.SetStateAction<boolean | 'SignIn' | ''>>,
    isEdit?: boolean,
    isSignIn?: boolean,
}

const initialData: User = {
    fullname: '',
    email: '',
    password: '',
    photo: '',
    username: '',
    userRole: 'EMPLOYEE',
    countryCode: '91',
    contact1: '',
    contact2: '',
    address: '',
    dob: dayjs(new Date()),
    gender: 'Male',
    createdBy: '',
    profileStatus: '',
    companyId: '',
    hrId: '',
}

const AddUser = ({ userData, setShowModal, isEdit, isSignIn }: Props) => {
    const router = useRouter()
    const [value, setValue] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [code, setCode] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue(userData as User)
        }
    }, [isEdit, userData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const newContact = value?.contact1?.split(' ').join('')?.split('+')?.[1]

        let image: string = ''

        if ((value.photo as File) instanceof File) {
            await cloudinaryImageUploadMethod(value.photo as File).then(r => {
                image = r?.secure_url
            })
        } else {
            image = value.photo as string
        }

        if (isEdit) {
            const formData: User = {
                ...value,
                contact1: newContact,
                photo: image,
            }
            await axios.put(`/api/User`, formData).then(r => {
                if (r.status == 200) {
                    router.refresh()
                    setShowModal(false)
                }
            }).finally(() => setLoading(false))
        } else {
            try {
                const formData: User = {
                    ...value,
                    contact1: newContact,
                    photo: image,
                    userRole: 'USER',
                    companyId: null,
                    hrId: null,
                    createdBy: undefined
                }

                await axios.post(`/api/User`, formData).then(async (r) => {
                    if (r.status == 200) {
                        await axios.get(`/api/LoginWithOtp?contact1=${newContact}&otp=${code}`).then(async (r) => {
                            if (r.status == 200) {
                                await signIn('credentials', {
                                    redirect: true,
                                    contact1: newContact,
                                    _id: r.data?.user?._id
                                })

                            }
                        }).catch((err) => {
                            const errorData = err.response?.data as { error: string }
                            setMsg(errorData.error)
                        }).finally(() => setLoading(false))

                        isSignIn ? setShowModal('') : setShowModal(false)
                    }
                }).finally(() => setLoading(false))
            }
            catch {
                setLoading(false)
                setMsg('User Already Exist')
            }
        }

    }

    const handleOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if ((userData && value.contact1 !== '' && value.contact1 !== userData?.contact1) || !isEdit) {
            setLoading(true)

            await axios.put(`/api/Otp`, { contact1: value.contact1, type: 'register' })
                .then(() => {
                    setMsg('')
                    setIsOtpSent(true)
                }).catch((err: AxiosError) => {
                    const errorData = err.response?.data as { error: string }

                    setMsg(errorData.error)
                }).finally(() => setLoading(false))

        } else {
            await handleSubmit(e)
        }
    }

    const handleOtpCheck = async (e: React.FormEvent) => {
        e.preventDefault()

        if (code !== '') {
            setLoading(true)
            await axios.post(`/api/Otp`, {
                code, contact1: value.contact1
            }).then(r => {
                if (r.status == 200) {
                    setMsg('')
                    handleSubmit(e)
                }
            }).catch((err: AxiosError) => {
                const errorData = err.response?.data as { error: string }

                setMsg(errorData.error)
            }).finally(() => setLoading(false))
        }
    }

    const url = value?.photo instanceof File ? URL.createObjectURL(value?.photo) : value?.photo

    return (
        <>{isOtpSent ?
            <form onSubmit={handleOtpCheck} className='flex flex-col gap-10 items-center'>
                <div>
                    <OtpInput
                        value={code}
                        onChange={setCode}
                        numInputs={6}
                        renderSeparator={<span></span>}
                        containerStyle='flex gap-2'
                        placeholder='******'
                        renderInput={(props) => <input {...props} className={`border-2 h-16 w-14 ${msg != '' ? 'border-red-300' : 'border-slate-400'} rounded-lg`} />}
                    />
                    {msg !== '' && <p className='text-red-500 text-lg mt-3 uppercase'>{msg}</p>}
                </div>

                <Button type='submit' className='bg-red-400 text-white py-5 w-full text-2xl' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : (isEdit ? 'Edit' : 'Register')}</Button>
            </form> :
            <form onSubmit={handleOtp} className='flex flex-col gap-10'>

                {isEdit && <Upload disabled={loading} multiple={false} label='Upload File' setValue={files => {
                    setValue(prev => ({ ...prev, photo: files?.[0] }))
                }} />}

                {url &&
                    <div className='size-52 aspect-square rounded-lg overflow-hidden relative'>
                        <Image src={url as string} alt='' fill objectFit='cover' />
                    </div>
                }

                <TextField id="outlined-basic" label="Full Name" variant="outlined"
                    value={value.fullname}
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, fullname: e.target.value }))}
                    required
                />

                <TextField id="outlined-basic" label="Email" variant="outlined"
                    value={value.email}
                    type='email'
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, email: e.target.value }))}
                    required
                />

                {/* {!isEdit && <TextField id="outlined-basic" label="Password" variant="outlined"
                    value={value.password}
                    type='password'
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, password: e.target.value }))}
                    required
                />} */}

                <div className='w-full'>
                    <MuiTelInput
                        label='Primary Contact'
                        defaultCountry='IN'
                        className='*:text-xl w-full'
                        value={value.contact1} onChange={e => setValue(prev => ({ ...prev, contact1: e }))}
                        required
                    />
                    {msg !== '' && <p className='text-red-500 text-lg uppercase'>{msg}</p>}
                </div>

                {isEdit && <TextField id="outlined-basic" label="DOB" variant="outlined"
                    value={dayjs(value.dob).format('YYYY-MM-DD')}
                    type='date'
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, dob: dayjs(e.target.value) }))}
                    required
                />}

                {isEdit && <TextField id="outlined-basic" label="Address" variant="outlined"
                    value={value.address}
                    multiline
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, address: e.target.value }))}
                    required
                />}

                {isEdit && <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label" className='text-2xl'>Select Gender</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        disabled={loading}
                        className='*:text-xl'
                        label='Select Gender'
                        value={value.gender}
                        onChange={(e) => e && setValue(prev => ({ ...prev, gender: e.target.value as User['gender'] }))}
                        required >
                        <MenuItem value='Male' className='text-xl'>Male</MenuItem>
                        <MenuItem value='Female' className='text-xl'>Female</MenuItem>
                        <MenuItem value='Others' className='text-xl'>Others</MenuItem>
                    </Select>
                </FormControl>}

                <Button type='submit' className='bg-red-400 text-white py-5 w-full text-2xl' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : (isEdit ? 'Edit' : 'Register')}</Button>
            </form>}
            {isSignIn && (
                <div className='w-full mt-5'>
                    <Button className='border-2 border-red-500 text-red-500 w-full text-2xl py-5' size='large' variant='outlined' onClick={() => setShowModal && setShowModal('SignIn')}>Sign In</Button>
                </div>
            )}
        </>
    )
}

export default AddUser