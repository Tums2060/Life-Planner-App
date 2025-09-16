import { useState } from "react";
import { Link } from "react-router-dom";

function SignUp(){
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sign Up Form submitted:", form);
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
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full py-2 px-4 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                    />  

                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full py-2 px-4 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                    />

                    <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full py-2 px-4 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                    />

                    <button
                    type="submit"
                    className="w-full bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
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