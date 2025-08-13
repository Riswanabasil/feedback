import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { InferType } from "yup";
import { adminFeedbackFilterSchema } from "../../validation/schemas";
import { getAdminFeedback, getAdminSummary } from "../../services/admin.service";

type AdminItem = {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  emotion: string | null;
  createdAt: string;
  user?: { _id: string; name: string; email: string } | null;
};
type FilterForm = InferType<typeof adminFeedbackFilterSchema>;

const PAGE_SIZES = [5, 10, 20];

export default function AdminFeedback() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [emotions, setEmotions] = useState<string[]>([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FilterForm>({
      resolver: yupResolver(adminFeedbackFilterSchema),
      defaultValues: { emotion: "", minRating: undefined },
      mode: "onChange",
    });

  useEffect(() => { (async () => {
  const s = await getAdminSummary();
  setEmotions(s.byEmotion.map(x => x.emotion).filter(Boolean));
})() }, []);
  const [filter, setFilter] = useState<FilterForm>({ emotion: "", minRating: undefined });

  const queryParams = useMemo(() => {
    const p: any = { page, limit };
    if (filter.emotion) p.emotion = filter.emotion;
    if (filter.minRating !== undefined) p.minRating = filter.minRating;
    return p;
  }, [page, limit, filter]);

  const load = async () => {
  setLoading(true);
  try {
    const data = await getAdminFeedback(queryParams);
    setItems(data.items); setTotal(data.total);
  } finally { setLoading(false); }
};
  useEffect(() => { load(); }, [page, limit, filter]);

  const onApply = (values: FilterForm) => {
    setPage(1);
    setFilter(values);
  };

  const onClear = () => {
    reset({ emotion: "", minRating: undefined });
    setFilter({ emotion: "", minRating: undefined });
    setPage(1);
  };

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Feedback</h1>

      <form onSubmit={handleSubmit(onApply)} className="bg-white p-4 rounded-xl shadow grid md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm mb-1">Emotion</label>
          <select className="w-full border rounded px-3 py-2" {...register("emotion")}>
            <option value="">All</option>
            {emotions.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Min rating</label>
          <input type="number" min={1} max={5} className="w-full border rounded px-3 py-2" {...register("minRating")} />
          {errors.minRating && <p className="text-xs text-red-600 mt-1">{errors.minRating.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Page size</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={limit}
            onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value, 10)); }}
          >
            {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="flex gap-2">
          <button disabled={isSubmitting} className="bg-black text-white rounded px-4 py-2">
            {isSubmitting ? "Applying..." : "Apply"}
          </button>
          <button type="button" onClick={onClear} className="border rounded px-4 py-2">
            Clear
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">User</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Rating</th>
              <th className="text-left px-4 py-2">Emotion</th>
              <th className="text-left px-4 py-2">Comment</th>
            </tr>
          </thead>
          <tbody>
            {!loading && items.map((it) => (
              <tr key={it._id} className="border-t">
                <td className="px-4 py-2 whitespace-nowrap">{new Date(it.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{it.user?.name ?? "—"}</td>
                <td className="px-4 py-2">{it.user?.email ?? "—"}</td>
                <td className="px-4 py-2">{it.rating}</td>
                <td className="px-4 py-2">
                  <span className="text-xs bg-gray-100 rounded px-2 py-0.5">{it.emotion ?? "—"}</span>
                </td>
                <td className="px-4 py-2 max-w-[420px]">
                  <div className="line-clamp-3">{it.comment}</div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">Loading…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">No results</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page <b>{page}</b> of <b>{pages}</b> — Total <b>{total}</b>
        </div>
        <div className="flex gap-2">
          <button
            className="border rounded px-3 py-1 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="border rounded px-3 py-1 disabled:opacity-50"
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
