'use client'

import React, { useState } from 'react'
import Jodit from './jodit'
import {  CircularProgress } from '@mui/material'
import Modal from '@/Components/Modal'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Button from '@/Components/Buttons'

type Props = {
    type: 'TermsConditions' | 'PrivacyPolicy',
    data: string
}

const PolicyEditor = ({ type, data }: Props) => {
    const router = useRouter()
    const [content, setContent] = useState(data || '')
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleSubmit = async () => {
        if (content !== '') {
            setLoading(true)

            await axios.put(`/api/Policy`, { contentType: type, content }).then(r => {
                if (r.status == 200) {
                    router.refresh()
                    setShowModal(false)
                }
            }).finally(() => setLoading(false))
        }
    }

    return (
        <div>
            <Button className='bg-red-500 text-white' disabled={loading} onClick={() => setShowModal(true)}> {data ? 'Edit' : 'Create'}</Button>

            <Modal open={showModal} setOpen={setShowModal} className='overflow-y-auto'>
                <div className='flex flex-col gap-10'>
                    <Jodit content={content} setContent={setContent} />

                    <Button className='bg-red-500 text-white w-fit py-5 px-10' size='large' disabled={loading} onClick={handleSubmit}>{loading ? <CircularProgress size={15} color='inherit'/> : (data ? 'Edit' : 'Create')}</Button>
                </div>
            </Modal>
        </div>
    )
}

export default PolicyEditor