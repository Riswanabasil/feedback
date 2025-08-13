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

  const getEmotionColor = (emotion: string | null) => {
    if (!emotion) return 'bg-gray-100 text-gray-600';
    const colors: { [key: string]: string } = {
      'positive': 'bg-green-100 text-green-700',
      'negative': 'bg-red-100 text-red-700',
      'neutral': 'bg-gray-100 text-gray-700',
      'happy': 'bg-yellow-100 text-yellow-700',
      'sad': 'bg-blue-100 text-blue-700',
      'angry': 'bg-red-100 text-red-700',
      'excited': 'bg-orange-100 text-orange-700',
    };
    return colors[emotion.toLowerCase()] || 'bg-purple-100 text-purple-700';
  };

  const getStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h5.586l1.707 1.707A1 1 0 0016 20v-2a4 4 0 00-4-4H9V5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                All Feedback
              </h1>
              <p className="text-gray-600 mt-1">Manage and analyze user feedback data</p>
            </div>
          </div>
        </div>

        {/* Filter Form */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Filters & Controls</h2>
          </div>

          <form onSubmit={handleSubmit(onApply)} className="grid lg:grid-cols-4 gap-6 items-end">
            {/* Emotion Filter */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Emotion</label>
              <div className="relative">
                <select className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none group-hover:border-gray-300 appearance-none" {...register("emotion")}>
                  <option value="">All Emotions</option>
                  {emotions.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
                <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <div className="relative">
                <input 
                  type="number" 
                  min={1} 
                  max={5} 
                  className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 pl-11 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none group-hover:border-gray-300" 
                  placeholder="1-5"
                  {...register("minRating")} 
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              {errors.minRating && <p className="text-xs text-red-500 mt-2 flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
                </svg>
                <span>{errors.minRating.message}</span>
              </p>}
            </div>

            {/* Page Size */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
              <div className="relative">
                <select
                  className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none group-hover:border-gray-300 appearance-none"
                  value={limit}
                  onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value, 10)); }}
                >
                  {PAGE_SIZES.map((n) => <option key={n} value={n}>{n} per page</option>)}
                </select>
                <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                disabled={isSubmitting} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg py-3 px-6 transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Applying...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Apply</span>
                  </>
                )}
              </button>
              <button 
                type="button" 
                onClick={onClear} 
                className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg py-3 px-6 transition-all duration-200 hover:bg-gray-50 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Clear</span>
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">User</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Rating</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Emotion</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Comment</th>
                </tr>
              </thead>
              <tbody>
                {!loading && items.map((it, index) => (
                  <tr key={it._id} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                      {new Date(it.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{it.user?.name ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{it.user?.email ?? "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {getStarRating(it.rating)}
                        </div>
                        <span className="text-sm font-bold text-gray-700">({it.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getEmotionColor(it.emotion)}`}>
                        {it.emotion ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="line-clamp-3 text-gray-700 leading-relaxed">{it.comment}</div>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <svg className="animate-spin w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600 font-medium">Loading feedback data...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <div>
                          <div className="text-gray-500 font-medium">No feedback found</div>
                          <div className="text-gray-400 text-sm">Try adjusting your filters</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Page <span className="font-bold text-gray-800">{page}</span> of <span className="font-bold text-gray-800">{pages}</span></span>
              <span className="text-gray-400">—</span>
              <span>Total <span className="font-bold text-gray-800">{total}</span> items</span>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-white border-2 border-gray-300 hover:border-gray-400 disabled:border-gray-200 text-gray-700 disabled:text-gray-400 font-semibold rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-gray-50 flex items-center space-x-2"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>
              <button
                className="bg-white border-2 border-gray-300 hover:border-gray-400 disabled:border-gray-200 text-gray-700 disabled:text-gray-400 font-semibold rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-gray-50 flex items-center space-x-2"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}