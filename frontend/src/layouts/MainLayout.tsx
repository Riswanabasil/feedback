import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MainLayout() {
  return (
    <div className="min-h-full bg-gray-50">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
