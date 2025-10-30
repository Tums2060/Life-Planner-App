import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SignUp(){
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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
        
        if (form.password !== form.confirmPassword){
            alert("Passwords do not match");
            return;
        }

        try{
            const response = await fetch("http://localhost:5001/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (response.ok){
                alert("Registration successfull");
                navigate("/login");
            } else {
                alert(data.message || "Registration failed!");
            } 
        }catch (error) {
                console.error("Error during registration:", error);
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
                        name="name"
                        placeholder="Name"
                        value={form.name}
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