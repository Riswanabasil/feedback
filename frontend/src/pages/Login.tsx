import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation/schemas";
import { apiUser } from "../lib/api";
import { setUserToken } from "../lib/auth";
import ErrorText from "../components/ErrorText";

type Form = { email: string; password: string };

export default function Login() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: yupResolver(loginSchema), mode: "onChange" });

  const onSubmit = async (values: Form) => {
    try {
      const { data } = await apiUser.post("/api/auth/login", values);
      setUserToken(data.token);
      nav("/feedback");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" {...register("email")} />
        </div>
        <ErrorText message={errors.email?.message} />
        <div>
          <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" {...register("password")} />
        </div>
        <ErrorText message={errors.password?.message} />
        <button disabled={isSubmitting} className="w-full bg-black text-white rounded py-2">
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
