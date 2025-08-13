import { Link, useNavigate } from "react-router-dom";
import { clearUserToken, getUserToken } from "../lib/auth";

export default function NavBar() {
  const nav = useNavigate();
  const loggedIn = !!getUserToken();

  const logout = () => {
    clearUserToken();
    nav("/login");
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link 
          to="/" 
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          AI Feedback
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link 
            to="/feedback" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
          >
            My Feedback
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          
          {!loggedIn ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/signup" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                Sign Up
              </Link>
              <Link 
                to="/login" 
                className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            </div>
          ) : (
            <button 
              onClick={logout} 
              className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-200"
            >
              Logout
            </button>
          )}
          
          <Link 
            to="/admin" 
            className="text-gray-600 hover:text-gray-800 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}