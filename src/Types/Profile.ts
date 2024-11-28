import { Moment } from "moment";

export interface User {
    _id?: string,
    username: string,
    userRole: 'SADMIN' | 'CADMIN' | 'HR' | 'EMPLOYEE' | 'HotelOwner' | 'USER' | '',
    email: string,
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