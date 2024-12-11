'use client'

import { TransactionType } from '@/Types/Transaction'
import { Button, CircularProgress, TextField } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
    data?: TransactionType,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    isEdit?: boolean,
}

const initialData: TransactionType = {
    payer_id: '',
    receiver_id: '',
    amount: 0,
    type: '',
    status: "pending"
}

const AddTransactions = ({ data, setShowModal, isEdit }: Props) => {
    const router = useRouter()
    const [value, setValue] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue(data as TransactionType)
        }
    }, [isEdit, data])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isEdit) {
                const formData: TransactionType = value

                await axios.put(`/api/transactions`, formData).then(r => {
                    if (r.status == 200) {
                        router.refresh()
                        setShowModal(false)
                    }
                }).finally(() => setLoading(false))
            } else {

                const formData: TransactionType = value

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

    return (
        <>
            <form onSubmit={handleSubmit} className='flex flex-col gap-10'>

                {msg !== '' && <p className='text-red-500 text-lg text-center'>{msg}</p>}

                <TextField id="outlined-basic" label="Amount" variant="outlined"
                    value={String(value.amount)}
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    required
                />

                <Button type='submit' className='bg-blue-500 text-white py-5' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : (isEdit ? 'Edit Transaction' : 'Add Transaction')}</Button>

            </form>

        </>
    )
}

export default AddTransactions