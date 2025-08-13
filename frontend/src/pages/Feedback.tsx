import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { feedbackSchema } from "../validation/schemas";
import ErrorText from "../components/ErrorText";
import { createFeedback } from "../services/feedback.service";
import { getApiError } from "../services/errors";
import { apiUser } from "../lib/api";

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
      await createFeedback(values);
      reset({ rating: 5, comment: "" });
      await load();
    } catch (e) {
      alert(getApiError(e, "Failed to submit"));
    }
  };

  const getStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      'positive': 'bg-green-100 text-green-700',
      'negative': 'bg-red-100 text-red-700',
      'neutral': 'bg-gray-100 text-gray-700',
      'happy': 'bg-yellow-100 text-yellow-700',
      'sad': 'bg-blue-100 text-blue-700',
      'angry': 'bg-red-100 text-red-700',
      'excited': 'bg-orange-100 text-orange-700',
    };
    return colors[emotion?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Feedback Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Share your thoughts and view your feedback history</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback Form Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 p-8 rounded-2xl shadow-xl shadow-gray-200/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Give Feedback</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Rating Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rating (1–5)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pl-11 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none group-hover:border-gray-300"
                    {...register("rating")}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <ErrorText message={errors.rating?.message} />
              </div>

              {/* Comment Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Comment
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none resize-none group-hover:border-gray-300"
                    placeholder="Share your thoughts and experiences..."
                    {...register("comment")}
                  />
                </div>
                <ErrorText message={errors.comment?.message} />
              </div>

              {/* Submit Button */}
              <button 
                disabled={isSubmitting} 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg py-3 px-4 transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Feedback</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Feedback History Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 p-8 rounded-2xl shadow-xl shadow-gray-200/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h5.586l1.707 1.707A1 1 0 0016 20v-2a4 4 0 00-4-4H9V5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">My Feedback</h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {list.map((f) => (
                <div key={f._id} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(f.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {f.emotion && (
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getEmotionColor(f.emotion)}`}>
                        {f.emotion}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">Rating:</span>
                    <div className="flex items-center space-x-1">
                      {getStarRating(f.rating)}
                    </div>
                    <span className="text-sm font-bold text-gray-800">({f.rating}/5)</span>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 leading-relaxed">{f.comment}</p>
                </div>
              ))}
              
              {list.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500 text-lg">No feedback yet</p>
                  <p className="text-gray-400 text-sm mt-1">Your feedback history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}