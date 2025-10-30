import { createContext, useState, useContext, useEffect } from "react";
import api from "../lib/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        const loadUserDetails = async () => {
            if (user?.token) {
                try {
                    const response = await api.get('/api/users/me');
                    const updatedUser = {
                        ...user,
                        ...response.data
                    };
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                } catch (error) {
                    console.error("Failed to load user details:", error);
                    // Handle token expiration or other errors
                    if (error.response?.status === 401) {
                        logout();
                    }
                }
            }
        };

        if (user?.token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
            loadUserDetails();
        } else {
            delete api.defaults.headers.common["Authorization"];
        }
    }, [user?.token]);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);