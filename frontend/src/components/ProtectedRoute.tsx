import { Navigate } from "react-router-dom";
import { getUserToken } from "../lib/auth";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = getUserToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
