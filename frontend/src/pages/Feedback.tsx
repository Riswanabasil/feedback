import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { feedbackSchema } from "../validation/schemas";
import { apiUser } from "../lib/api";
import ErrorText from "../components/ErrorText";

type Fb = { _id: string; rating: number; comment: string; emotion: string; createdAt: string };
type Form = { rating: number; comment: string };

export default function FeedbackPage() {
  const [list, setList] = useState<Fb[]>([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<Form>({ resolver: yupResolver(feedbackSchema), defaultValues: { rating: 5, comment: "" }, mode: "onChange" });

  const load = async () => {
    const { data } = await apiUser.get("/api/feedback/me");
    setList(data.feedback);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (values: Form) => {
    try {
      await apiUser.post("/api/feedback", values);
      reset({ rating: 5, comment: "" });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to submit");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Give feedback</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Rating (1–5)</label>
            <input
              type="number"
              min={1}
              max={5}
              className="w-full border rounded px-3 py-2"
              {...register("rating")}
            />
            <ErrorText message={errors.rating?.message} />
          </div>

          <div>
            <label className="block text-sm mb-1">Comment</label>
            <textarea
              rows={4}
              className="w-full border rounded px-3 py-2"
              placeholder="Write your thoughts..."
              {...register("comment")}
            />
            <ErrorText message={errors.comment?.message} />
          </div>

          <button disabled={isSubmitting} className="bg-black text-white rounded px-4 py-2">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">My feedback</h2>
        <ul className="space-y-3">
          {list.map((f) => (
            <li key={f._id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(f.createdAt).toLocaleString()}
                </span>
                <span className="text-xs bg-gray-100 rounded px-2 py-0.5">
                  {f.emotion || "…"}
                </span>
              </div>
              <div className="mt-1 text-sm">Rating: <b>{f.rating}</b></div>
              <p className="mt-1">{f.comment}</p>
            </li>
          ))}
          {list.length === 0 && <p className="text-sm text-gray-500">No feedback yet.</p>}
        </ul>
      </div>
    </div>
  );
}
