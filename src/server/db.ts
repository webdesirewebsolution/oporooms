"use server"

import client from "@/Lib/mongo";
import { HotelTypes } from "@/Types/Hotels";
import { RoomVarietyTypes } from "@/Types/Rooms";
import { Collection } from "mongodb";
import { SearchParams } from "next/dist/server/request/search-params";

export const getHotels = async ({ searchParams }: { searchParams: SearchParams }): Promise<{ data: HotelTypes[], count: number }> => {
    const hotelColl: Collection<HotelTypes> = client.collection('Hotels')
    const limit = searchParams?.limit ? Number(searchParams?.limit) : 10
    const skip = searchParams?.skip ? Number(searchParams?.skip) : 0
    const searchKeys: { [key: string]: unknown } = {}

    if (searchParams?.min && searchParams?.max) searchKeys['rooms.0.price'] = { $gte: Number(searchParams.min), $lte: Number(searchParams.max) }

    if (searchParams?.min) searchKeys['rooms.0.price'] = { $gte: Number(searchParams.min) }
    if (searchParams?.name) searchKeys['name'] = new RegExp(String(searchParams.name), 'i')

    const data = searchParams?.lng && await hotelColl.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [Number(searchParams?.lng), Number(searchParams?.lat)] },
                distanceField: "dist.calculated",
                includeLocs: "location",
                spherical: true,
                minDistance: 0,
                maxDistance: 10000,
            },
        },

        {
            '$lookup': {
                'as': 'Rooms',
                'from': 'Rooms',
                'foreignField': 'hotelId',
                'localField': '_id'
            }
        }, {
            '$addFields': {
                'roomCount': {
                    '$size': '$Rooms'
                }
            }
        },
        {
            $match: {
                ...searchKeys,
                roomCount: { $gt: 0 }
            }
        },
    ]).limit(limit).skip(skip).toArray()

    const counts = searchParams?.lng ? await hotelColl.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [Number(searchParams?.lng), Number(searchParams?.lat)] },
                distanceField: "dist.calculated",
                includeLocs: "location",
                spherical: true,
                minDistance: 0,
                maxDistance: 10000,
            },
        },
        {
            '$lookup': {
                'as': 'Rooms',
                'from': 'Rooms',
                'foreignField': 'hotelId',
                'localField': '_id'
            }
        }, {
            '$addFields': {
                'roomCount': {
                    '$size': '$Rooms'
                }
            }
        },
        {
            $match: {
                ...searchKeys,
                roomCount: { $gt: 0 }
            }
        },
    ]).toArray() : []

    const roomData: {
        hotelId: string, data: {
            totalSize: [] | [{
                TotalSize: 0;
            }];
            bookingSize: [] | [{
                BookingSize: 0;
            }];
        }
    }[] = []

    if (data) {
        for (const item of data) {
            for (const room of item.rooms) {
                const d = await getRooms({ type: room.type }).then(res => {
                    return res
                })
                roomData.push({
                    hotelId: item._id,
                    data: d
                })
            }
        }
    }

    (data as HotelTypes[])?.forEach((item, index) => {
        item.rooms.forEach((room, index) => {
            roomData.forEach((roomItem, index) => {
                if (String(roomItem.hotelId) === String(item._id)) {
                    const totalSize = roomItem.data.totalSize[0]?.TotalSize || 0
                    const bookingSize = roomItem.data.bookingSize[0]?.BookingSize || 0
                    const remainingSize = totalSize - bookingSize
                    item.size = roomItem.data
                    item.remainingSize = remainingSize
                }
            })
        })
    });

    (counts as HotelTypes[])?.forEach((item, index) => {
        item.rooms.forEach((room, index) => {
            roomData.forEach((roomItem, index) => {
                if (String(roomItem.hotelId) === String(item._id)) {
                    console.log(roomItem.data)
                    const totalSize = roomItem.data.totalSize[0]?.TotalSize || 0
                    const bookingSize = roomItem.data.bookingSize[0]?.BookingSize || 0
                    const remainingSize = totalSize - bookingSize

                    item.size = roomItem.data
                    item.remainingSize = remainingSize
                }
            })
        })
    });

    const newData = (data as HotelTypes[])?.filter((item, index) => {
        if (searchParams?.rooms && Number(searchParams?.rooms) <= (item.remainingSize as number)) {
            return true
        } else false
    })

    const newCount = (counts as HotelTypes[])?.filter((item, index) => {
        if (searchParams?.rooms && Number(searchParams?.rooms) <= (item.remainingSize as number)) {
            return true
        } else false
    })

    return ({ data: newData, count: newCount.length }) as { data: HotelTypes[], count: number };
}

export const getRooms = async ({ type }: { type: RoomVarietyTypes['type'] }) => {
    const roomsColl = client.collection("Rooms");

    const totalSize = await roomsColl.aggregate([
        {
            $match: {
                type
            }
        },
        {
            '$addFields': {
                'id': {
                    '$toString': '$_id'
                }
            }
        }, {
            '$lookup': {
                'from': 'Bookings',
                'localField': 'id',
                'foreignField': 'assignedRooms._id',
                'as': 'BookingsData'
            }
        }, {
            '$lookup': {
                'from': 'Hotels',
                'localField': 'hotelId',
                'foreignField': '_id',
                'as': 'HotelData'
            }
        },
        {
            '$addFields': {
                'BookingsSize': {
                    '$size': '$BookingsData'
                }
            }
        },
        {
            $count: "TotalSize"
        },
    ]).toArray()

    const bookingSize = await roomsColl.aggregate([
        {
            $match: {
                type
            }
        },
        {
            '$addFields': {
                'id': {
                    '$toString': '$_id'
                }
            }
        }, {
            '$lookup': {
                'from': 'Bookings',
                'localField': 'id',
                'foreignField': 'assignedRooms._id',
                'as': 'BookingsData'
            }
        }, {
            '$lookup': {
                'from': 'Hotels',
                'localField': 'hotelId',
                'foreignField': '_id',
                'as': 'HotelData'
            }
        },
        {
            '$addFields': {
                'BookingsSize': {
                    '$size': '$BookingsData'
                }
            }
        },
        {
            $match: {
                'BookingsSize': { $gt: 0 }
            }
        },
        {
            $count: "BookingSize"
        },
    ]).toArray()

    return ({ totalSize, bookingSize }) as { totalSize: [] | [{ TotalSize: 0 }], bookingSize: [] | [{ BookingSize: 0 }] }
}