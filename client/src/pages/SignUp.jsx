import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios.js";

function SignUp(){
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try{
            const res = await api.post("/auth/register", {
                username: form.username,
                email: form.email,
                password: form.password,
            });

            console.log("✅ Registration successful:", res.data.user, res.data.token);
            alert("Registration successful!");
            navigate("/login");
        } catch (error) {
                console.error("❌ Registration failed:", error.response?.data || error);
                alert("Something went wrong. Please try again later.");
            }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
                    <p className="text-gray-500">And start planning your Student life</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none hover:border-green-400 hover:shadow-md hover:shadow-green-100 transition duration-200"
                    />

                    <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none hover:border-green-400 hover:shadow-md hover:shadow-green-100 transition duration-200"
                    />  

                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none hover:border-green-400 hover:shadow-md hover:shadow-green-100 transition duration-200"
                    />

                    <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none hover:border-green-400 hover:shadow-md hover:shadow-green-100 transition duration-200"
                    />

                    <button
                    type="submit"
                    className="w-full py-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-200 ease-in-out">
                        Sign Up
                    </button>

                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-500 font-medium hover:underline">
                        Login here
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default SignUp;