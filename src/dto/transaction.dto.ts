export interface P2PTransferDTO {
    payerCvu: number;
    payeeCvu: number;
    amount: number;
    currency: string;
}

export interface DepositDTO {
    payeeCvu: number;
    amount: number;
    currency: string;
    externalReference: string;
}

export interface WithdrawalDTO {
    payerCvu: number;
    amount: number;
    currency: string;
    externalReference: string;
}

export interface TransactionResponseDTO {
    status: string;
    id: number;
    payerCvu?: number;
    payeeCvu?: number;
    amount: number;
    currency: string;
    timestamp: string;
    type: string;
    externalReference?: string;
}
