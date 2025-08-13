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
    <nav className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold">AI Feedback</Link>
        <div className="flex items-center gap-4">
          <Link to="/feedback" className="text-sm hover:underline">My Feedback</Link>
          {!loggedIn ? (
            <>
              <Link to="/signup" className="text-sm">Sign Up</Link>
              <Link to="/login" className="text-sm">Login</Link>
            </>
          ) : (
            <button onClick={logout} className="text-sm text-red-600">Logout</button>
          )}
          <Link to="/admin" className="text-sm">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
