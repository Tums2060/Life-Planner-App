import './App.css';

import Landingpage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Form from './components/ContactForm.jsx';
import Reminders from './pages/Reminders.jsx';
import Timetable from './pages/Timetable.jsx';
import Goals from './pages/Goals.jsx';
import Habits from './pages/Habits.jsx';
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
          <Route path='/Timetable' element={<Timetable />} />
          <Route path='/Goals' element={<Goals />} />
          <Route path='/Habits' element={<Habits />} />
        </Routes>
      </Router>

      <Footer />

    </div>
  );
}

export default App;
