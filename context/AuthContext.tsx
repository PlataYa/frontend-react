// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import Storage from "@/utils/Storage";
import { LoginResponseDTO, LoginRequestDTO, RegisterRequestDTO } from "@/dto/user.dto";
import { loginUser, registerUser } from "@/services/api";

interface AuthContextType {
    user: LoginResponseDTO | null;
    isLoading: boolean;
    isRestoring: boolean;
    error: string | null;
    login: (data: LoginRequestDTO) => Promise<boolean>;
    register: (data: RegisterRequestDTO) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<LoginResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRestoring, setIsRestoring] = useState(true);

    useEffect(() => {
        const restoreUser = async () => {
            setIsRestoring(true);
            try {
                const stored = await Storage.getItem("user");
                if (stored) setUser(JSON.parse(stored));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsRestoring(false);
            }
        };
        restoreUser();
    }, []);

    const login = async (data: LoginRequestDTO): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await loginUser(data);
            setUser(res);
            await Storage.setItem("user", JSON.stringify(res));
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
            await registerUser(data);
            return true;
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
            await Storage.deleteItem("user");
            setUser(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isRestoring, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
};
