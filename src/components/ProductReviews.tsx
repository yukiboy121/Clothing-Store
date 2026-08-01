"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";

interface Review {
  id: number;
  rating: number;
  comment: string;
  isVerifiedBuyer: boolean;
  createdAt: string;
  userId: number;
}

export function ProductReviews({ productId }: { productId: number }) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to submit a review.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setReviews([data.review, ...reviews]);
      setComment("");
      setRating(5);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  return (
    <div className="mt-20 border-t border-white/10 pt-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wider text-white">
            CUSTOMER REVIEWS
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mx-0.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-white">
              {averageRating} out of 5
            </span>
            <span className="text-xs text-white/50">({reviews.length} Reviews)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Review Form */}
        <div className="lg:col-span-4">
          <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-6">
              Write a Review
            </h3>
            
            {error && <p className="text-xs text-red-400 mb-4">{error}</p>}
            
            {!user ? (
              <div className="text-center py-6">
                <p className="text-xs text-white/50 mb-4">You must be logged in to leave a review.</p>
                <a href="/login" className="px-6 py-2.5 bg-white text-black text-[10px] uppercase font-bold tracking-widest rounded-lg">Sign In</a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-2">Rating</label>
                  <div className="flex gap-1 text-amber-400 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        onClick={() => setRating(star)}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={star <= rating ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="hover:scale-110 transition-transform"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-2">Your Comment (Optional)</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-widest uppercase rounded-xl border border-white/10 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-8">
          {loading ? (
            <p className="text-white/40 text-xs">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center border border-white/5 border-dashed rounded-2xl">
              <p className="text-white/40 text-sm">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-white/5 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={i < review.rating ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            className="mx-0.5"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[10px] text-white/40">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {review.isVerifiedBuyer && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  
                  {review.comment && (
                    <p className="text-sm text-white/80 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
