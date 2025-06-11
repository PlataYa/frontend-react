import axios from 'axios';
import {
    RegisterRequestDTO,
    RegisterResponseDTO,
    LoginRequestDTO,
    LoginResponseDTO,
    UserResponseDTO
} from '../dto/user.dto';
import { WalletResponseDTO } from '../dto/wallet.dto';
import {
    P2PTransferDTO,
    DepositDTO,
    WithdrawalDTO,
    TransactionResponseDTO
} from '../dto/transaction.dto';

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Users
export const registerUser = async (userData: RegisterRequestDTO): Promise<RegisterResponseDTO> => {
    const response = await api.post('/user/register', userData);
    return response.data;
};

export const loginUser = async (credentials: LoginRequestDTO): Promise<LoginResponseDTO> => {
    const response = await api.post('/user/login', credentials);
    return response.data;
};

export const getAllUsers = async (): Promise<UserResponseDTO[]> => {
    const response = await api.get('/user/users');
    return response.data;
};

// Wallets
export const getWalletByCVU = async (cvu: number): Promise<WalletResponseDTO> => {
    const response = await api.get(`/wallet/${cvu}`);
    return response.data;
};

export const getWalletByMail = async (userMail: string): Promise<WalletResponseDTO> => {
    const response = await api.get(`/wallet/mine?mail=${encodeURIComponent(userMail)}`);
    return response.data;
};

export const getAllWallets = async (): Promise<WalletResponseDTO[]> => {
    const response = await api.get('/wallet/all');
    return response.data;
}

export const createWalletForUser = async (userMail: string): Promise<WalletResponseDTO> => {
    const response = await api.post(`/wallet/${userMail}`);
    return response.data;
};

export const validateCVU = async (cvu: number): Promise<boolean> => {
    const response = await api.get(`/wallet/valid/${cvu}`);
    return response.data.valid;
}

// Transactions
export const sendP2PTransaction = async (data: P2PTransferDTO): Promise<TransactionResponseDTO> => {
    const response = await api.post('/transaction/transfer', data);
    return response.data;
};

export const depositToWallet = async (depositData: DepositDTO): Promise<TransactionResponseDTO> => {
    const response = await api.post('/transaction/deposit', depositData);
    return response.data;
};

export const withdrawFromWallet = async (data: WithdrawalDTO): Promise<TransactionResponseDTO> => {
    const response = await api.post('/transactions/withdraw', data);
    return response.data;
};

export const getTransactionById = async (transactionId: number): Promise<TransactionResponseDTO> => {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
};

export const getTransactionHistory = async (cvu: number): Promise<TransactionResponseDTO[]> => {
    const response = await api.get(`/api/v1/transaction/${cvu}/history`);
    return response.data;
};

export default api;
