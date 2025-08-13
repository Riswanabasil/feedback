import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { InferType } from "yup";
import { adminLoginSchema } from "../../validation/schemas";
import { adminLogin } from "../../services/auth.service";
import { setAdminToken } from "../../lib/auth";
import { getApiError } from "../../services/errors";

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
      const data = await adminLogin(values);
      setAdminToken(data.token);
      nav("/admin/dashboard");
    } catch (e) {
      alert(getApiError(e, "Login failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      
      <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl shadow-2xl shadow-black/50 relative">
     
        <div className="text-center mb-8 mt-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg border border-red-500/50">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-gray-400 text-sm mt-2">Authorized Personnel Only</p>
        
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Administrator Username
            </label>
            <div className="relative">
              <input 
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-3 pl-11 text-gray-100 placeholder-gray-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-200 outline-none group-hover:border-gray-600" 
                placeholder="Enter admin username" 
                {...register("username")} 
              />
              <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {errors.username && <p className="text-xs text-red-400 mt-2 flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
              </svg>
              <span>{errors.username.message}</span>
            </p>}
          </div>

          {/* Password Field */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Administrator Password
            </label>
            <div className="relative">
              <input 
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-3 pl-11 text-gray-100 placeholder-gray-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-200 outline-none group-hover:border-gray-600" 
                type="password" 
                placeholder="Enter admin password" 
                {...register("password")} 
              />
              <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-2 flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
              </svg>
              <span>{errors.password.message}</span>
            </p>}
          </div>

          {/* Submit Button */}
          <button 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg py-3 px-4 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 disabled:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 border border-red-500/50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Secure Login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
              </svg>
              <span>SSL Encrypted Connection</span>
            </div>
            <div>© {new Date().getFullYear()} Admin Portal - All rights reserved</div>
          </div>
        </div>
      </div>
    </div>
  );
}