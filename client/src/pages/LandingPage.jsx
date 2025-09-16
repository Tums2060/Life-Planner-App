import { Link } from "react-router-dom";

function LandingPage(){
    return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
       This is the Landing Page
      </h1>
      
      <p className="mt-6 text-sm text-center text-gray-600">
        <Link to="/login" className="text-blue-500 hover:underline">Go to Login Page</Link>
      </p>

        <p className="mt-2 text-sm text-center text-gray-600">
          
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up here
          </Link>
        </p>

    </div>
  );
}

export default LandingPage;