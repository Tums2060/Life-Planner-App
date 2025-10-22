import './App.css';

import Landingpage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Form from './components/ContactForm.jsx';
import Reminders from './pages/Reminders.jsx';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Router>
        <Routes>
          <Route path='/' element={<Landingpage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/contact' element={<Form />} />
          <Route path='/Reminders' element={<Reminders />} />
        </Routes>
      </Router>

      <Footer />

    </div>
  );
}

export default App;
