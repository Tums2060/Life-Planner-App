import './App.css';
import Landingpage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">

      <Router>
        <Routes>
          <Route path='/' element={<Landingpage />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
