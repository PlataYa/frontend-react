import axios from 'axios';
import {
    P2PTransferDTO,
    TransactionResponseDTO,
    WithdrawalDTO
} from '../dto/transaction.dto';
import {
    LoginRequestDTO,
    LoginResponseDTO,
    RegisterRequestDTO,
    RegisterResponseDTO,
    UserResponseDTO
} from '../dto/user.dto';
import { WalletResponseDTO } from '../dto/wallet.dto';

// Definimos la URL base de la API, usando la variable de entorno si está disponible
// o una URL por defecto en caso contrario
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Log para debugging en desarrollo
console.log('API_BASE_URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Añadir interceptor para debugging
api.interceptors.request.use(
    (config) => {
        console.log(`Realizando petición a: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Users
export const registerUser = async (userData: RegisterRequestDTO): Promise<RegisterResponseDTO> => {
    console.log("registrando");
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
    const response = await api.get(`/wallet/valid/cvu?cvu=${cvu}`);
    return response.data.valid;
}

// Transactions
export const sendP2PTransaction = async (data: P2PTransferDTO): Promise<TransactionResponseDTO> => {
    try {
        const response = await api.post('/transaction/transfer', data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data || 'Error en la transferencia');
        }
        throw new Error('Error de conexión');
    }
};

export const withdrawFromWallet = async (data: WithdrawalDTO): Promise<TransactionResponseDTO> => {
    try {
        const response = await api.post('/transaction/withdrawal', data);
        console.log("WITHDRAWAL RESPONSE:", response.data)
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data || 'Error en el retiro');
        }
        throw new Error('Error de conexión');
    }
};

export const depositToWallet = async (data: WithdrawalDTO): Promise<TransactionResponseDTO> => {
    try {
        const response = await api.post('/transaction/deposit', data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data || 'Error en el depósito');
        }
        throw new Error('Error de conexión');
    }
}

export const getTransactionById = async (transactionId: number): Promise<TransactionResponseDTO> => {
    const response = await api.get(`/transaction/transfer/${transactionId}`);
    return response.data;
};

export const getTransactionHistory = async (cvu: number): Promise<TransactionResponseDTO[]> => {
    const response = await api.get(`/transaction/${cvu}/history`);
    return response.data;
};

export default api;
