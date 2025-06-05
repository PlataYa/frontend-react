export interface WalletResponseDTO {
    cvu: number;
    balance: number;
    userMail: string;
}

export interface AllWalletsResponseDTO {
    wallets: WalletResponseDTO[];
}
