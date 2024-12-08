export interface WalletType {
    _id?: string,
    balance: number,
    userRole: 'SADMIN' | 'CADMIN' | 'HotelOwner',
    recentTransaction: number,
}

export interface WalletAction extends WalletType {
    action: string
}