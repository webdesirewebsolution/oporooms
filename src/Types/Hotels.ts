import { ObjectId } from "mongodb";
import { RoomVarietyTypes } from "./Rooms";

export interface AddressTypes {
    lat: number,
    lng: number,
    placeId?: string,
    City?: string,
    Locality?: string,
}

export interface HotelTypes {
    _id?: string | ObjectId,
    hotelUId?: string,
    hotelOwnerId?: string,
    photos: string[],
    name: string,
    address: AddressTypes,
    desc: '',
    customAddress: string,
    rooms: RoomVarietyTypes[],
    status: 'approved' | 'pending' | 'declined',
    amenities: string[],
    size: { totalSize: [] | [{ TotalSize: 0 }], bookingSize: [] | [{ BookingSize: 0 }] }
    remainingSize?: number,
}

export interface HotelActions extends HotelTypes {
    roomActions: string,
    hotelActions: string,
}