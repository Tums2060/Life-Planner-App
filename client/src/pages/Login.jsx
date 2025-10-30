import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios.js";

function Login() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", {
                emailOrUsername: email || username,
                password,
            });

            // Save user + token to context/localStorage
            login(res.data.user, res.data.token);
            navigate("/Timetable");
        } catch (error) {
            console.error("❌ Login failed:", error.response?.data || error.message);
            alert("Invalid credentials.");
        }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
                <div className="mb-6 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
                    <p className="text-gray-500">Login to you Life Planner Dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                    type="email"
                    placeholder="Email or Username"
                    value={email || username}
                    onChange={(e) => setEmail(e.target.value) || setUsername(e.target.value)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none hover:border-blue-400 hover:shadow-md hover:shadow-blue-100 transition duration-200"
                    />

                    <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none hover:border-blue-400 hover:shadow-md hover:shadow-blue-100 transition duration-200"
                    />

                    <div className="flex justify-between text-sm">
                        <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
                    </div>

                    <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200 ease-in-out">
                        Login
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 font-medium hover:underline">
                        Sign up for free
                    </Link>
                </p>


        
            </div>
        </div>

        
    )
}

export default Login;