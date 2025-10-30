import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from "lucide-react";
import { useAuth } from '../context/AuthContext';


function Navbar(){
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return(

        <nav className='flex items-center justify-between px-8 py-4 bg-white border-b border-gray-300 shadow-sm sticky top-0 z-50'>

            <div className='flex-items-center space-x-2'>
                <BookOpen className='w-8 h-8 text-blue-600' />
                <Link
                    to='/'
                    className='text-xl font-semibold text-gray-800 tracking-tight hover:text-blue-600 transition-colors'
                    >
                        Life Planner
                </Link>
            </div>

            <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
                <li>
                    <Link to='/Timetable'
                    className='hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1'
                    >
                        Timetables
                    </Link>
                </li>

                <li>
                    <Link to='/Goals'
                    className='hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1'
                    >
                        Goals
                    </Link>
                </li>

                <li>
                    <Link to='/Habits'
                    className='hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1'
                    >
                        Habits
                    </Link>
                </li>

                <li>
                    <Link to='/Reminders'
                    className='hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1'
                    >
                        Reminders
                    </Link>
                </li>
            </ul>

            <div className='flex items-center space-x-4'>
                {user ? (
                    <>
                        <span className='text-gray-700'>Welcome, {user?.username || user?.email || "User"}!</span>
                        <button
                            onClick={handleLogout}
                            className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition'
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className='px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition'
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>

        </nav>
    );
};

export default Navbar;