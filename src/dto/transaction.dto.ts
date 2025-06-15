export interface P2PTransferDTO {
    payerCvu: number;
    payeeCvu: number;
    amount: number;
    currency: string;
}

export interface WithdrawalDTO {
    sourceCvu: number;
    destinationCvu?: number;
    amount: number;
    currency: string;
    externalReference?: string;
}

export interface TransactionResponseDTO {
    transactionId: number;
    type: string;
    payerCvu?: number;
    payeeCvu?: number;
    sourceCvu?: number;
    destinationCvu?: number;
    amount: number;
    currency: string;
    status: string;
    externalReference?: string;
    createdAt: string;
}
