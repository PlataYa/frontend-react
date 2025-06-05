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

export const createWalletForUser = async (userMail: string): Promise<WalletResponseDTO> => {
    const response = await api.post(`/wallet/${userMail}`);
    return response.data;
};

// Transactions
export const sendP2PTransaction = async (data: P2PTransferDTO): Promise<TransactionResponseDTO> => {
    const response = await api.post('/transactions/p2p', data);
    return response.data;
};

export const depositToWallet = async (data: DepositDTO): Promise<TransactionResponseDTO> => {
    const response = await api.post('/transactions/deposit', data);
    return response.data;
};

export const withdrawFromWallet = async (data: WithdrawalDTO): Promise<TransactionResponseDTO> => {
    const response = await api.post('/transactions/withdrawal', data);
    return response.data;
};

export const getTransactionById = async (transactionId: number): Promise<TransactionResponseDTO> => {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
};

export default api;
