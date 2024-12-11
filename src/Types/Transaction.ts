import { Bookings } from "./Booking"
import { User } from "./Profile"

export interface TransactionType {
    _id?: string,
    booking_id?: string,
    payer_id?: string,
    receiver_id?: string,
    amount: number,
    type?: "upi" | "cash" | "debit_card" | "credit_card" | string,
    status: "pending" | "completed" | "cancelled",
    created_at?: Date,
    updated_at?: Date,
    bookings?: Bookings,
    payer?: User,
    receiver?: User
}

export interface TransactionAction extends TransactionType {
    action: string,
    name1: string,
    name2: string,
}