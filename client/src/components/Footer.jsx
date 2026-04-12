import React from 'react';

function Footer() {

    return (
        <footer className='bg-blue-900 text-white py-6 text-center'>
            <p>© {new Date().getFullYear()} Life Planner. All rights reserved.</p>
        </footer>
    );
}

export default Footer;