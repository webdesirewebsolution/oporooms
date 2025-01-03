import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'

type Props = {
    item: {
        title: string,
        subCities: {
            name: string,
            placeId: string,
            latitude: number,
            longitude: number,
            city: string,
        }[]
    },
    children: React.ReactNode
}

const Cities = ({ item, children }: Props) => {

    return (
        <div className='relative'>
            <Link href='/' className='text-[rgba(0,0,0,.7)] text-center'>
                {children}
            </Link>
            {item?.subCities?.length > 0 && <ul className='absolute bg-white px-14 left-0 py-10 hidden flex-col group-hover:flex top-[3.31rem] gap-7'>
                <p className='font-semibold'>Popular Localities</p>
                {item?.subCities?.map((subItem) => (
                    <Link href={{
                        pathname: 'Hotels',
                        query: {
                            placeId: subItem.placeId,
                            city: subItem.city,
                            lat: subItem.latitude,
                            lng: subItem.longitude,
                            checkIn: dayjs(Date.now()).valueOf(),
                            checkOut: dayjs(Date.now()).add(1 , 'day').valueOf(),
                            rooms: 1,
                            adults: 1,
                            childrens: 0
                        }
                    }} key={subItem.name} className='text-nowrap' title={subItem.name}>
                        {subItem.name}
                    </Link>
                ))}
            </ul>}
        </div>
    )
}

export default Cities