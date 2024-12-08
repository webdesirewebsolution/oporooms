'use client'

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '@/Context/context'
import { WalletType } from '@/Types/Wallet'
import { FaWallet } from 'react-icons/fa6'

const Transaction = () => {
    const { user } = useContext(Context)
    const [data, setData] = useState<WalletType>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            setLoading(true)
            if (user?.userRole !== '') {
                await axios.get(`/api/wallet`).then(r => {
                    if (r.status == 200) {
                        setData(r.data?.list)
                    }
                }).finally(() => setLoading(false))
            }
        })()
    }, [user])

    return (
        <div className='flex flex-col gap-10'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-semibold'>Wallet</h1>
            </div>

            <div className='flex gap-10 flex-wrap'>
                <div className='shadow p-10 w-[30rem] max-w-full flex flex-col gap-5 rounded-2xl'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-3xl'>Total Balance</h1>
                        <div className='bg-red-100 p-4 rounded-xl'>
                            <FaWallet color='red' size={20} />
                        </div>
                    </div>
                    <p className='text-4xl font-semibold'>&#8377;{data?.balance || "12345"}</p>
                </div>
                <div className='shadow p-10 w-[30rem] max-w-full flex flex-col gap-5 rounded-2xl'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-3xl'>Recent Transaction</h1>
                        <div className='bg-red-100 p-4 rounded-xl'>
                            <FaWallet color='red' size={20} />
                        </div>
                    </div>
                    <p className='text-4xl font-semibold'>&#8377;{data?.recentTransaction || "12345"}</p>
                </div>
            </div>
        </div>
    )
}

export default Transaction