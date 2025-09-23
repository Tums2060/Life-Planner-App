import { useState } from "react";
import { Link } from "react-router-dom";

function Login(){
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(" Login Form submitted:", form);
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
                    type="text"
                    name="email"
                    placeholder="Email or Username"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full py-2 px-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full py-2 px-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    <div className="flex justify-between text-sm">
                        <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
                    </div>

                    <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
                        Login
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 font-medium hover:underline">
                        Sign up for free
                    </Link>
                </p>


        
            </div>
        </div>

        
    )
}

export default Login;