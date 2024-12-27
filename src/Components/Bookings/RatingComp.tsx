'use client'

import { User } from '@/Types/Profile'
import { Rating } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
    user: User
    hotelId: string,
    hotelOwnerId: string
}

const RatingComp = ({ user, hotelId, hotelOwnerId }: Props) => {
    const router = useRouter()
    const [value, setValue] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            await axios.get(`/api/Ratings?user._id=${user?._id}&hotelId=${hotelId}`).then(r => {
                if (r.status == 200) {
                    setValue(Number(r.data[0]?.value))
                }
            })
        })()
    }, [user, hotelId])

    const handleRating = async (value: number) => {
        setLoading(true)
        await axios.put(`/api/Ratings`, {
            value,
            hotelId,
            hotelOwnerId,
            user
        }).then((r) => {
            if (r.status == 200) {
                router.refresh()
            }
        }).finally(() => setLoading(false))
    }


    return (
        <div>
            <Rating name="half-rating" defaultValue={0} precision={0.5} value={value} onChange={(event, newValue) => {
                if (newValue) {
                    setValue(newValue);
                    handleRating(newValue)
                }
            }} size='large' />
        </div>
    )
}

export default RatingComp