import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../lib/auth";

export default function AdminLayout() {
  const nav = useNavigate();
  const logout = () => {
    clearAdminToken();
    nav("/admin"); 
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm px-3 py-1.5 rounded ${isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"}`;

  return (
    <div className="min-h-full bg-gray-50">
      <nav className="w-full border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold">AI Feedback — Admin</div>
          <div className="flex items-center gap-2">
            <NavLink to="/admin/dashboard" className={linkCls}>Dashboard</NavLink>
            <NavLink to="/admin/feedback" className={linkCls}>Feedback</NavLink>
            <button onClick={logout} className="text-sm text-red-600 px-3 py-1.5 rounded hover:bg-red-50">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
