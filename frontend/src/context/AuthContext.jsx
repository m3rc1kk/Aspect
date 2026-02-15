import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import authService from '../api/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const response = await authService.signIn(credentials);
        setUser(response.user);
        return response;
    };

    const register = async (userData) => {
        const response = await authService.signUp(userData);
        setUser(response.user);
        return response;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const isAuthenticated = useMemo(() => !!user || authService.isAuthenticated(), [user]);

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
