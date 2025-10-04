import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Header = () => {
  const navigate = useNavigate();
  const {isAuthenticated, logout} = useAuth()

  useEffect(() => {
  }, []);



  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-md backdrop-blur-md">
      {/* Left - Logo / Home link */}
      <Link
        to="/"
        className="text-2xl font-bold hover:text-blue-600 dark:hover:text-blue-400"
      >
        EduCode
      </Link>

      {/* Right - Navigation buttons */}
      {isAuthenticated?(
        <div className="flex items-center">
          <button
            onClick={() => logout()}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Logout
          </button>
        </div>
      ):
      (
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/auth/login")}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Login
          </button>
  
          <button
            onClick={() => navigate("/auth/register")}
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition"
          >
            Register
          </button>
        </div>
      )
    }
    </header>
  );
};

export default Header;
