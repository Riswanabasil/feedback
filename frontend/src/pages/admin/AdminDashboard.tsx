import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getAdminSummary } from "../../services/admin.service";

type Summary = {
  byEmotion: { emotion: string; count: number }[];
  avgRating: number;
  totalFeedback: number;
};

export default function AdminDashboard() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
useEffect(() => { (async () => setData(await getAdminSummary()))().finally(() => setLoading(false)); }, []);
  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Failed to load summary.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Link to="/admin/feedback" className="text-sm underline">Go to Feedback Table</Link>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-sm text-gray-500">Total Reviews</div>
          <div className="text-2xl font-bold">{data.totalFeedback}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-sm text-gray-500">Average Rating</div>
          <div className="text-2xl font-bold">{data.avgRating.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-sm text-gray-500">Emotions</div>
          <div className="text-2xl font-bold">{data.byEmotion.length}</div>
        </div>
      </div>

      {/* Emotion distribution chart */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="mb-3 font-medium">Emotion Distribution</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byEmotion}>
              <XAxis dataKey="emotion" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
