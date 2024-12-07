import { RoomVarietyTypes } from "./Rooms";

export interface AddressTypes {
    lat: number,
    lng: number,
    placeId?: string,
    City?: string,
    Locality?: string,
}

export interface HotelTypes {
    _id?: string,
    hotelUId?: string,
    hotelOwnerId?: string,
    photos: string[],
    name: string,
    address: AddressTypes,
    customAddress: string,
    rooms: RoomVarietyTypes[],
    status: 'approved' | 'pending' | 'declined',
    amenities: string[]
}

export interface HotelActions extends HotelTypes {
    roomActions: string,
    hotelActions: string,
}