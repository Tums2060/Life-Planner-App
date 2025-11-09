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
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const { user } = useAuth();
  
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path='/' element={<Landingpage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/contact' element={<Form />} />

          {/* Protected Routes */}
           <Route path='/Reminders' element={<ProtectedRoute><Reminders /></ProtectedRoute>} /> 
          <Route path='/Timetable' element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
          {/* <Route path='/Goals' element={<ProtectedRoute><Goals /></ProtectedRoute>} /> */}
          {/* Testing without protection */}
          <Route path='/Goals' element={<Goals />} />

          <Route path='/Habits' element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
