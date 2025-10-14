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