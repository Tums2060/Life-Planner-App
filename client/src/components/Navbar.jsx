import React from 'react';
import { BookOpen } from "lucide-react";  
 

function Navbar(){

    return(

        <nav className='flex items-center justify-between px-8 py-4 bg-white border-b border-gray-300 shadow-sm sticky top-0 z-50'>

            <div className='flex-items-center space-x-2'>
                <BookOpen className='w-8 h-8 text-blue-600' />
                <a
                    href='/'
                    className='text-xl font-semibold text-gray-800 tracking-tight hover:text-blue-600 transition-colors'
                    >
                        Life Planner
                </a>
            </div>

            <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
                <li>
                    <a href='/Timetable'
                    className='hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1'
                    >
                        Timetables
                    </a>
                </li>

                <li>
                    <a href='/Goals'
                    className='hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1'
                    >
                        Goals
                    </a>
                </li>

                <li>
                    <a href='/Habits'
                    className='hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1'
                    >
                        Habits
                    </a>
                </li>

                <li>
                    <a href='/Reminders'
                    className='hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1'
                    >
                        Reminders
                    </a>
                </li>
            </ul>

            <div className='flex items-center space-x-4'>
                <a
                    href="/login"
                    className='px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition'
                >
                    Login
                </a>

                <a
                    href="/signup"
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                >
                    Sign Up
                </a>
            </div>

        </nav>
    );
};

export default Navbar;