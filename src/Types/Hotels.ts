import { RoomVarietyTypes } from "./Rooms";

export interface AddressTypes {
    lat: string,
    lng: string,
    placeId?: string,
    City?: string,
    Locality?: string,
}

export interface HotelTypes {
    _id?: string,
    hotelOwnerId?: string,
    photos: string[],
    name: string,
    address: AddressTypes,
    rooms: RoomVarietyTypes[],
    status: 'approved' | 'pending' | 'declined',
    amenities: string[]
}

export interface HotelActions extends HotelTypes {
    roomActions: string,
    hotelActions: string,
}