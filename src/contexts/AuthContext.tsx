/**
 * t3-chat-frontend/contexts/AuthContext.tsx
 *
 * Provides a global context for the authenticated user's state.
 * It fetches the current user's data on initial load and makes it
 * available to all child components.
 */
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '@/types/api';
import { getCurrentUser, logoutUser as apiLogout } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        const loadUser = async () => {
            try {
                if (localStorage.getItem('jwt_token')) {
                    const userData = await getCurrentUser();
                    setUser(userData);
                }
            } catch (error: unknown) {
                console.error('Failed to fetch user, token might be invalid.', error);
                setUser(null);
                // Optional: clear the invalid token
                apiLogout();
            } finally {
                setIsLoading(false);
            }
        }
        loadUser();
    }, []);

    const logout = () => {
        apiLogout();
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{user,isLoading,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=():AuthContextType=>{
    const context=useContext(AuthContext);
    if(context===undefined){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};