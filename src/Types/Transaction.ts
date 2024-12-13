import { ObjectId } from "mongodb"
import { Bookings } from "./Booking"
import { User } from "./Profile"

export interface TransactionType {
    _id?: string | ObjectId,
    booking_id?: string,
    photo?: string | File,
    payer_id?: string,
    receiver_id?: string,
    amount: number,
    type?: "upi" | "cash" | "debit_card" | "credit_card" | string,
    status?: "pending" | "completed" | "cancelled",
    transactionDate?: Date,
    created_at?: Date,
    updated_at?: Date,
    bookings?: Bookings,
    utr?: string,
    payer?: User,
    receiver?: User
}

export interface TransactionAction extends TransactionType {
    action: string,
    name1: string,
    name2: string,
}