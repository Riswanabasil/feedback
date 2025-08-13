import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import FeedbackPage from "./pages/Feedback";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import AdminFeedback from "./pages/admin/AdminFeedback";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/feedback" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
      </Route>

      <Route path="*" element={<div className="p-8">Not found</div>} />
    </Routes>
  );
}
