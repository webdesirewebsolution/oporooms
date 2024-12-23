"use server"

import client from "@/Lib/mongo";
import { HotelTypes } from "@/Types/Hotels";
import { RoomVarietyTypes } from "@/Types/Rooms";
import { Collection } from "mongodb";
import { SearchParams } from "next/dist/server/request/search-params";

export const getHotels = async ({ searchParams }: { searchParams: SearchParams }): Promise<{ data: HotelTypes[], count: number, roomData: { totalSize: [] | [{ TotalSize: 0 }], bookingSize: [] | [{ BookingSize: 0 }] } }> => {
    const hotelColl: Collection<HotelTypes> = client.collection('Hotels')
    const limit = searchParams?.limit ? Number(searchParams?.limit) : 10
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
    ]).limit(limit).skip(0).toArray()

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
        {
            $count: 'count'
        },
    ]).limit(limit).skip(0).toArray() : []

    let roomData = {}

    if (data) {
        for (const item of data) {
            for (const room of item.rooms) {
                roomData = await getRooms({ type: room.type })
            }
        }
    }

    const count = counts[0]?.count

    return ({ data, count, roomData }) as { data: HotelTypes[], count: number, roomData: { totalSize: [] | [{ TotalSize: 0 }], bookingSize: [] | [{ BookingSize: 0 }] } };
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

    return { totalSize, bookingSize } as { totalSize: [] | [{ TotalSize: 0 }], bookingSize: [] | [{ BookingSize: 0 }] }
}