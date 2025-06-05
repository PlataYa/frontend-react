import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponseDTO } from '../dto/user.dto';

type AuthUser = LoginResponseDTO & { id?: number };

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  logUserIn: (userData: LoginResponseDTO) => Promise<void>;
  removeUser: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = '@auth_user';
const TOKEN_STORAGE_KEY = '@auth_token';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user data and token on app startup
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    Promise.all([
      AsyncStorage.getItem(AUTH_STORAGE_KEY),
      AsyncStorage.getItem(TOKEN_STORAGE_KEY),
    ])
      .then(([storedUser, storedToken]) => {
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      })
      .catch((error) => {
        console.error('Error checking auth state:', error);
        // Clear potentially corrupted data
        clearAuthData();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logUserIn = async (userData: LoginResponseDTO) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData)),
        AsyncStorage.setItem(TOKEN_STORAGE_KEY, userData.token),
      ]);
      setUser(userData);
      setToken(userData.token);
    } catch (error) {
      console.error('Error storing user data:', error);
      throw new Error('Failed to save user session');
    }
  };

  const removeUser = async () => {
    try {
      await clearAuthData();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };

  const updateUser = async (userData: Partial<AuthUser>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw new Error('Failed to update user data');
    }
  };

  const clearAuthData = async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_STORAGE_KEY),
      AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
    ]);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, logUserIn, removeUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
