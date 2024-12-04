import { Bookings } from "./Booking"
import { HotelTypes } from "./Hotels"

// single room details of any hotel
export interface RoomsTypes {
    _id?: string,
    id?: number,
    hotelOwnerId?: string,
    hotelId?: string,
    photos?: string[],
    number: number,
    type: string,
    hotelData?: HotelTypes
}

// here type means varities of rooms
export interface RoomVarietyTypes {
    id?: number,
    type: string,
    regularPrice: string | number,
    price: string | number,
    timing?: string,
    photos: string[],
    fee: string | number,
    amenities: string[]
}

export interface RoomActions extends RoomsTypes {
    actions: string,
    BookingsData: Bookings[]
}