import { HotelTypes } from "./Hotels"

// single room details of any hotel
export interface RoomsTypes {
    _id?: string,
    hotelOwnerId?: string,
    hotelId?: string,
    photos: string[],
    number: number,
    type: string,
    hotelData?: HotelTypes
}

// here type means varities of rooms
export interface RoomVarietyTypes {
    id?: number,
    type: string,
    price: string | number,
    timing?: string,
    photos: string[],
    fee: string | number,
    amenities: string[]
}

export interface RoomActions extends RoomsTypes {
    actions: string
}