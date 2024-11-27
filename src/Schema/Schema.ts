import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Types.ObjectId

const UserSchema = {
    username: String,
    userRole: String,
    email: String,
    photo: String,
    fullname: String,
    countryCode: String,
    contact1: String,
    contact2: {
        type: String,
        required: false
    },
    address: String,
    dob: Date,
    gender: String,
    createdBy: String,
    profileStatus: String,
    companyId: {
        type: ObjectId, required: false
    },
    hrId: {
        type: ObjectId, required: false
    },
}

const AddressSchema = {
    lat: String,
    lng: String,
    placeId: {
        type: String, required: false
    },
    City: {
        type: String, required: false
    },
    Locality: {
        type: String, required: false
    },
}

const HotelSchema = {
    hotelOwnerId: ObjectId,
    photos: Array,
    name: String,
    address: AddressSchema,
    rooms: Array,
    status: String,
    amenities: String
}


const AssignedRooms = {
    _id: String,
    photos: Array,
    number: Number,
    type: String,
}

const RoomVarietySchema = {
    type: String,
    price: Number,
    timing: {
        type: String, required: false
    },
    photos: Array,
    fee: Number,
    amenities: Array
}

const RoomSchema = {
    placeId: {
        type: String, required: false
    },
    lat: Number,
    lng: Number,
    checkIn: Date,
    checkOut: Date,
    rooms: Number,
    adults: Number,
    childrens: Number,
    roomData: RoomVarietySchema
}

const BookingSchema = new Schema({
    userId: {
        type: ObjectId
    },
    companyId: {
        type: ObjectId, required: false
    },
    hotelOwnerId: ObjectId,
    hotelId: ObjectId,
    bookingId: ObjectId,
    bookingUid: String,
    bookingType: String,
    status: String,
    bookingStatus: String,
    bookingDate: Date,
    createdAt: Date,
    details: HotelSchema,
    userDetails: UserSchema,
    assignedRooms: [AssignedRooms],
    roomDetails: RoomSchema,
    roomType: String,
    paymentMode: String,
    transactionDetails: Object,
});

export default {
    Bookings: mongoose.model("Bookings", BookingSchema)
}