"use server"

import { newDate } from "@/Functions";
import client from "@/Lib/mongo";
import { HotelTypes } from "@/Types/Hotels";
import { RoomVarietyTypes } from "@/Types/Rooms";
import moment from "moment";
import { Collection, ObjectId } from "mongodb";
import { SearchParams } from "next/dist/server/request/search-params";

type RoomData = {
    hotelId: string, data: {
        totalSize: [] | [{
            TotalSize: 0;
        }];
        bookingSize: [] | [{
            BookingSize: 0;
        }];
    }
}

export const getHotels = async ({ searchParams }: { searchParams: SearchParams }): Promise<{ data: HotelTypes[], count: number, roomData: RoomData[] }> => {
    const hotelColl: Collection<HotelTypes> = client.collection('Hotels')
    const limit = searchParams?.limit ? Number(searchParams?.limit) : 10
    const skip = searchParams?.skip ? Number(searchParams?.skip) : 0
    const searchKeys: { [key: string]: unknown } = {}
    if (searchParams?.min) searchKeys['rooms.0.price'] = { $gte: Number(searchParams.min) }
    const checkIn = searchParams?.checkIn && Number(searchParams.checkIn)
    const checkOut = searchParams?.checkOut && Number(searchParams.checkOut)
    const totalDays = (checkIn && checkOut) ? moment(checkOut).diff(checkIn, 'days') : 1

    if (searchParams?.min && searchParams?.max) searchKeys['rooms.0.price'] = { $gte: Number(searchParams.min), $lte: Number(searchParams.max) }

    if (searchParams?.name) searchKeys['name'] = new RegExp(String(searchParams.name), 'i')

    const aggregation = [
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
        // {
        //     $match: {
        //         _id: new ObjectId("67570cdcacc6a3155f1af82d")
        //     }
        // },
        {
            '$lookup': {
                'as': 'Rooms',
                'from': 'Rooms',
                'foreignField': 'hotelId',
                'localField': '_id'
            }
        }, {
            '$addFields': {
                'stringHotelId': {
                    '$toString': '$_id'
                }
            }
        }, {
            '$lookup': {
                'as': 'Bookings',
                'from': 'Bookings',
                'foreignField': 'hotelId',
                'localField': 'stringHotelId'
            }
        }, {
            '$addFields': {
                'rooms': {
                    '$map': {
                        'input': '$rooms',
                        'as': 'room',
                        'in': {
                            '$mergeObjects': [
                                '$$room', {
                                    'count': {
                                        '$size': {
                                            '$filter': {
                                                'input': '$Rooms',
                                                'as': 'roomItem',
                                                'cond': {
                                                    '$eq': [
                                                        '$$roomItem.type', '$$room.type'
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }, {
                                    'bookingCount': {
                                        '$size': {
                                            '$filter': {
                                                'input': '$Bookings',
                                                'as': 'bookingItem',
                                                'cond': {
                                                    $and: [
                                                        {
                                                            $eq: [
                                                                "$$bookingItem.roomType",
                                                                "$$room.type"
                                                            ]
                                                        },
                                                        {
                                                            $not:
                                                            {
                                                                $and: [
                                                                    {
                                                                        $or: [
                                                                            { $lt: ["$$bookingItem.roomDetails.checkIn", newDate(new Date(checkIn as string))] },
                                                                            { $gte: ["$$bookingItem.roomDetails.checkIn", newDate(new Date(checkOut as string))] }
                                                                        ]
                                                                    },
                                                                    {
                                                                        $or: [
                                                                            { $lte: ["$$bookingItem.roomDetails.checkOut", newDate(new Date(checkIn as string))] },
                                                                            { $gt: ["$$bookingItem.roomDetails.checkOut", newDate(new Date(checkOut as string))] }
                                                                        ]
                                                                    }
                                                                ]
                                                                // $or: [
                                                                //     {
                                                                //         $or: [
                                                                //             {
                                                                //                 $lte: [
                                                                //                     "$$bookingItem.roomDetails.checkIn",
                                                                //                     newDate(new Date(checkIn as string))
                                                                //                 ]
                                                                //             },
                                                                //             {
                                                                //                 $lte: [
                                                                //                     "$$bookingItem.roomDetails.checkIn",
                                                                //                     newDate(new Date(checkOut as string))
                                                                //                 ]
                                                                //             },
                                                                //         ]
                                                                //     },
                                                                //     {
                                                                //       $gte: [
                                                                //         "$$bookingItem.roomDetails.checkOut",
                                                                //         new Date(
                                                                //           "2024-12-29T02:09:37.155+00:00"
                                                                //         )
                                                                //       ]
                                                                //     },
                                                                //     {
                                                                //       $lte: [
                                                                //         "$$bookingItem.roomDetails.checkIn",
                                                                //         new Date(
                                                                //           "2024-12-26T02:09:37.155+00:00"
                                                                //         )
                                                                //       ]
                                                                //     }
                                                                // ]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            '$addFields': {
                'totalRooms': {
                    '$sum': '$rooms.count'
                },
                'totalBookings': {
                    '$sum': '$rooms.bookingCount'
                }
            }
        },
        {
            '$match': {
                '$expr': {
                    '$gt': ['$totalRooms', '$totalBookings']
                }
            }
        },
        {
            '$match': {
                '$expr': {
                    $and: [
                        { $gt: ['$totalRooms', 0] },
                        { $gte: ['$totalRooms', Number(searchParams.rooms)] }
                    ]
                },
                ...searchKeys,
            }
        },
        {
            $unset: ["Rooms", "Bookings"]
        },
        {
            $project: {
                Address: 1,
                "Google Rating": 1,
                "address": {
                    City: 1,
                    Locality: 1
                },
                amenities: 1,
                customAddress: 1,
                desc: 1,
                name: 1,
                photos: 1,
                rooms: 1,
            }
        }
    ]

    const count: { dataSize: number }[] | undefined = searchParams?.lng ? await hotelColl.aggregate<{ dataSize: number }>([
        ...aggregation,
        {
            $count: "dataSize"
        }
    ]).toArray() : undefined

    const data = searchParams?.lng && await hotelColl.aggregate(aggregation).limit(limit).skip(skip).toArray()

    const dataSize: number = count ? count?.[0]?.dataSize : 0;

    // [
    //     {
    //         $geoNear: {
    //             near: { type: "Point", coordinates: [Number(searchParams?.lng), Number(searchParams?.lat)] },
    //             distanceField: "dist.calculated",
    //             includeLocs: "location",
    //             spherical: true,
    //             minDistance: 0,
    //             maxDistance: 10000,
    //         },
    //     },

    //     {
    //         '$lookup': {
    //             'as': 'Rooms',
    //             'from': 'Rooms',
    //             'foreignField': 'hotelId',
    //             'localField': '_id'
    //         }
    //     }, {
    //         '$addFields': {
    //             'roomCount': {
    //                 '$size': '$Rooms'
    //             }
    //         }
    //     },
    //     {
    //         $match: {
    //             ...searchKeys,
    //             roomCount: { $gt: 0 }
    //         }
    //     },
    // ]

    // const counts = searchParams?.lng ? await hotelColl.aggregate(aggregation).toArray() : []

    // const roomData: RoomData[] = []

    // if (data) {
    //     for (const item of (data as HotelTypes[])) {
    //         for (const room of item.rooms) {
    //             const d = await getRooms({ type: room.type, hotelId: item._id as ObjectId }).then(res => {
    //                 return res
    //             })
    //             roomData.push({
    //                 hotelId: item._id as string,
    //                 data: d
    //             })
    //         }
    //     }
    // }


    // (data as HotelTypes[])?.forEach((item, index) => {
    //     item.rooms.forEach((room, index) => {
    //         roomData.forEach((roomItem, index) => {
    //             if (String(roomItem.hotelId) === String(item._id)) {
    //                 const totalSize = roomItem.data.totalSize[0]?.TotalSize || 0
    //                 const bookingSize = roomItem.data.bookingSize[0]?.BookingSize || 0
    //                 const remainingSize = totalSize - bookingSize
    //                 item.size = roomItem.data
    //                 item.remainingSize = remainingSize
    //             }
    //         })
    //     })
    // });

    // (counts as HotelTypes[])?.forEach((item, index) => {
    //     item.rooms.forEach((room, index) => {
    //         roomData.forEach((roomItem, index) => {
    //             if (String(roomItem.hotelId) === String(item._id)) {
    //                 const totalSize = roomItem.data.totalSize[0]?.TotalSize || 0
    //                 const bookingSize = roomItem.data.bookingSize[0]?.BookingSize || 0
    //                 const remainingSize = totalSize - bookingSize

    //                 item.size = roomItem.data
    //                 item.remainingSize = remainingSize
    //             }
    //         })
    //     })
    // });

    // const newData = (data as HotelTypes[])?.filter((item, index) => {
    //     if (searchParams?.rooms && (Number(searchParams?.rooms) <= (item.remainingSize as number))) {
    //         return true
    //     } else false
    // })

    // const newCount = (counts as HotelTypes[])?.filter((item, index) => {
    //     if (searchParams?.rooms && (Number(searchParams?.rooms) <= (item.remainingSize as number) || (item.size?.totalSize?.[0] && Number(searchParams?.rooms) <= item.size?.totalSize?.[0]?.TotalSize))) {
    //         return true
    //     } else false
    // })

    return ({ data, count: dataSize }) as { data: HotelTypes[], count: number, roomData: RoomData[] };
}

export const getRooms = async ({ type, hotelId }: { type: RoomVarietyTypes['type'], hotelId: ObjectId }) => {
    const roomsColl = client.collection("Rooms");

    const totalSize = await roomsColl.aggregate([
        {
            $match: {
                type,
                hotelId: new ObjectId(hotelId)
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
                'foreignField': '_i d',
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

export const getSingleHotel = async ({ _id }: { _id: ObjectId }) => {
    const hotelColl: Collection<HotelTypes> = client.collection('Hotels')
    const data = hotelColl.findOne({ _id: new ObjectId(_id) })
    return data
}