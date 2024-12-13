'use client'

import Upload from '@/Components/Upload'
import cloudinaryImageUploadMethod from '@/Functions/cloudinary'
import { TransactionType } from '@/Types/Transaction'
import { Button, CircularProgress, TextField } from '@mui/material'
import axios, { AxiosError } from 'axios'
import moment from 'moment'
import { MuiTelInput } from 'mui-tel-input'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import OTPInput from 'react-otp-input'

type Props = {
  data?: TransactionType,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  isEdit?: boolean,
}

// interface FormData extends TransactionType {
//   mobileNumber: string
// }

const initialData: TransactionType = {
  amount: 0,
  transactionDate: new Date(),
  status: 'completed',
  utr: '',
  photo: ''
}

const AddPay = ({ data, setShowModal, isEdit }: Props) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [value, setValue] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [code, setCode] = useState('')

  useEffect(() => {
    if (isEdit) {
      setValue(data as TransactionType)
    }
  }, [isEdit, data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newContact = mobileNumber?.split(' ').join('')?.split('+')?.[1]

      let image: string = ''

      if ((value.photo as File) instanceof File) {
        await cloudinaryImageUploadMethod(value.photo as File).then(r => {
          image = r?.secure_url
        })
      } else {
        image = value.photo as string
      }

      if (isEdit) {
        const formData = { ...value, payer_id: session?.user._id, photo: image, mobileNumber: newContact }

        await axios.put(`/api/transactions`, formData).then(r => {
          if (r.status == 200) {
            router.refresh()
            setShowModal(false)
          }
        }).finally(() => setLoading(false))
      } else {

        const formData = { ...value, payer_id: session?.user._id, photo: image, mobileNumber: newContact }

        await axios.post(`/api/transactions`, formData).then(r => {
          if (r.status == 200) {
            router.refresh()
            setShowModal(false)
          }
        }).finally(() => setLoading(false))
      }
    } catch {
      setLoading(false)
    }
  }

  const url = value?.photo instanceof File ? URL.createObjectURL(value?.photo) : value?.photo


  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    await axios.put(`/api/Otp`, { contact1: '+918874059274' })
      .then(() => {
        setMsg('')
        setIsOtpSent(true)
      }).catch((err: AxiosError) => {
        const errorData = err.response?.data as { error: string }
        setMsg(errorData.error)
      }).finally(() => setLoading(false))

  }

  const handleOtpCheck = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code !== '') {
      setLoading(true)
      await axios.post(`/api/Otp`, {
        code, contact1: '+918874059274'
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


  return (
    <>
      {isOtpSent ?
        <form onSubmit={handleOtpCheck} className='flex flex-col gap-10 items-center'>
          <div>
            <OTPInput
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

          <Button type='submit' className='bg-red-400 text-white py-5 w-full text-2xl' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : (isEdit ? 'Edit' : 'Submit')}</Button>
        </form> :

        <form onSubmit={handleOtp} className='flex flex-col gap-10'>

          {msg !== '' && <p className='text-red-500 text-lg text-center'>{msg}</p>}

          <Upload disabled={loading} multiple={false} id='Photo' label='Upload File' setValue={files => {
            setValue(prev => ({ ...prev, photo: files?.[0] }))
          }} />

          {url &&
            <Image src={url as string} alt='' width={100} height={100} className='aspect-square rounded-lg w-52' />}

          <MuiTelInput
            id="outlined-basic" label="Mobile Number" variant="outlined"
            value={mobileNumber}
            defaultCountry='IN'
            className='*:text-xl'
            onChange={e => setMobileNumber(e)}
            required
          />

          <TextField id="outlined-basic" label="Date" variant="outlined"
            value={moment(value.transactionDate).format('YYYY-MM-DD')}
            className='*:text-xl'
            type='date'
            onChange={e => setValue(prev => ({ ...prev, transactionDate: new Date(e.target.value) }))}
            required
          />

          <TextField id="outlined-basic" label="UTR/Reference Number" variant="outlined"
            value={value.utr}
            className='*:text-xl'
            onChange={e => setValue(prev => ({ ...prev, utr: e.target.value }))}
            required
          />

          <TextField id="outlined-basic" label="Amount" variant="outlined"
            value={String(value.amount)}
            type='number'
            className='*:text-xl'
            onChange={e => setValue(prev => ({ ...prev, amount: Number(e.target.value) }))}
            required
          />

          <Button type='submit' className='bg-red-500 text-white py-5' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : (isEdit ? 'Edit Transaction' : 'Add Transaction')}</Button>

        </form>}

    </>
  )
}

export default AddPay