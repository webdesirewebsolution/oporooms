export interface TransactionType {
    _id?: string,
}

export interface TransactionAction extends TransactionType {
    action: string
}