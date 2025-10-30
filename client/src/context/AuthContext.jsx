import { createContext, useState, useContext, useEffect } from "react";
import api from "../lib/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // When user or token changes, attach Authorization header globally
    useEffect(() => {
        if (user?.token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
        } else {
            delete api.defaults.headers.common["Authorization"];
        }
    }, [user]);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);