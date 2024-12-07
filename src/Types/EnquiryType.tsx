export interface EnquiryTypes {
    _id?: string,
    fullname: string,
    email: string,
    contact1: string,
    userRole?: 'HotelOwner' | 'CADMIN'
}