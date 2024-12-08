import { ObjectId } from "mongodb"
import { HotelTypes } from "./Hotels"
import { User } from "./Profile"
import { RoomsTypes, RoomVarietyTypes } from "./Rooms"

export interface Room {
    placeId?: string,
    lat?: number,
    lng?: number,
    checkIn?: Date,
    checkOut?: Date,
    rooms?: number,
    adults?: number,
    childrens?: number,
    roomData: RoomVarietyTypes
}

export interface Hotel {
    _id?: string,
    hotelOwnerId?: string,
    photos: string[],
    name: string,
    address: {
        lat: string,
        lng: string,
        City?: string,
        Locality?: string,
        placeId?: string
    },
    rooms: RoomsTypes[],
    status: "pending" | "approved" | "declined",
    amenities: string[]
}

export interface Transactions {
    cost: string | number,
    fee: string | number
}

export interface AssignedRooms {
    _id: string,
    photos: string[],
    number: number,
    type: string,
}

export interface Bookings {
    _id?: string,
    userId: string | ObjectId,
    companyId?: string,
    hotelOwnerId?: string | ObjectId,
    hotelId?: string | ObjectId,
    bookingId?: string | ObjectId,
    bookingUid: string,
    bookingType: 'Hotel' | 'Flight' | 'Train' | 'Bus',
    status: "pending" | "booked" | "declined" | "cancel request" | "cancelled",
    bookingStatus: "pending" | "approved" | "declined" | '',
    bookingDate: Date,
    createdAt?: Date,
    details: HotelTypes,
    userDetails: User,
    assignedRooms: AssignedRooms[],
    roomDetails: Room,
    roomType: string,
    paymentMode: "Pay at hotel" | "Pay by company" | "Online Pay",
    transactionDetails: Transactions,
    paymentStatus?: "pending" | "approved" | "declined" | '',
    totalRating?: number
}

export interface BookingFields extends Bookings {
    viewRooms: string,
    actions: string
}