import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { InferType } from "yup";
import { adminLoginSchema } from "../../validation/schemas";
import { apiAdmin } from "../../lib/api";
import { setAdminToken } from "../../lib/auth";

type AdminLoginForm = InferType<typeof adminLoginSchema>;

export default function AdminLogin() {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginForm>({
    resolver: yupResolver(adminLoginSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: AdminLoginForm) => {
    try {
      const { data } = await apiAdmin.post("/api/admin/login", values);
      setAdminToken(data.token);
      nav("/admin/dashboard");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input className="w-full border rounded px-3 py-2" placeholder="Username" {...register("username")} />
          {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" {...register("password")} />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>
        <button disabled={isSubmitting} className="w-full bg-black text-white rounded py-2">
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
