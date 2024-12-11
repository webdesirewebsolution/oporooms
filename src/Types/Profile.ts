import { Moment } from "moment";
import { ObjectId } from "mongodb";

export interface User {
    _id?: string | ObjectId,
    username?: string,
    userRole: 'SADMIN' | 'CADMIN' | 'HR' | 'EMPLOYEE' | 'HotelOwner' | 'USER' | '',
    email: string,
    wallet?: number,
    photo?: File | string,
    fullname?: string,
    countryCode?: string,
    contact1?: string,
    contact2?: string,
    address?: string,
    dob?: Moment | Date,
    gender?: string,
    createdBy?: string,
    profileStatus?: string,
    companyId?: string | null,
    hrId?: string | null,
    password?: string
}

export interface UserAction extends User {
    actions: string
}