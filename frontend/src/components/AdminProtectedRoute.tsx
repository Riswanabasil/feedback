import { Navigate } from "react-router-dom";
import { getAdminToken } from "../lib/auth";

export default function AdminProtectedRoute({ children }: { children: JSX.Element }) {
  const token = getAdminToken();
  return token ? children : <Navigate to="/admin" replace />;
}
