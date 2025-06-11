import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { loginUser, registerUser } from "@/services/api";
import {
    LoginRequestDTO,
    RegisterRequestDTO,
    LoginResponseDTO,
} from "@/dto/user.dto";

const saveToken = async (token: string) => {
    if (Platform.OS === "web") {
        await AsyncStorage.setItem("token", token);
    } else {
        await SecureStore.setItemAsync("token", token);
    }
};

const getToken = async (): Promise<string | null> => {
    if (Platform.OS === "web") {
        return await AsyncStorage.getItem("token");
    } else {
        return await SecureStore.getItemAsync("token");
    }
};

const deleteToken = async () => {
    if (Platform.OS === "web") {
        await AsyncStorage.removeItem("token");
    } else {
        await SecureStore.deleteItemAsync("token");
    }
};

export const useAuth = () => {
    const [user, setUser] = useState<LoginResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            setIsLoading(true);
            try {
                const token = await getToken();
                if (token) {
                    setUser({ token } as LoginResponseDTO);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (data: LoginRequestDTO): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await loginUser(data);
            setUser(res);
            await saveToken(res.token);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Error al iniciar sesión");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterRequestDTO): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await registerUser(data);
            return !!res;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Error al registrarse");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteToken();
            setUser(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const isAuth = (): boolean => !!user?.token;

    return {
        login,
        register,
        logout,
        isAuth,
        isLoading,
        error,
        user,
    };
};
