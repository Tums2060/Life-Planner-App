import { createContext, useState, useContext, useEffect } from "react";
import api from "../lib/axios.js";

const AuthContext = createContext();

// AuthContext.jsx
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        const parsedUser = savedUser ? JSON.parse(savedUser) : null;

        // Set the authorization header if we have a saved user with token
        if (parsedUser?.token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
        }

        return parsedUser;
    });

    useEffect(() => {
        const loadUserDetails = async () => {
            if (user?.token) {
                try {
                    // Make sure the Authorization header is set
                    api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
                    console.log('Authorization header:', api.defaults.headers.common["Authorization"]);


                    const response = await api.get('/auth/users/me');
                    console.log('User details response:', response.data);
                    console.log('Current user state:', user);


                    const updatedUser = {
                        ...user,
                        ...response.data,
                        token: user.token // Preserve the token
                    };
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                } catch (error) {
                    console.error("Failed to load user details:", error);
                    if (error.response?.status === 401) {
                        logout();
                    }
                }
            }
        };

        loadUserDetails();
    }, [user?.token]);

    const login = (userData) => {
        if (userData.token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
        }
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);