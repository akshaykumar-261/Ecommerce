import { useState } from "react";
import {
  Check,
  MessageSquare,
  Send,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useCreateReview,
  useDeleteReview,
  useMyReview,
  useProductReviews,
  useUpdateReview,
} from "../../api/useReviews";

const getReviewerName = (review) =>
  review.user?.name ||
  review.reviewer?.name ||
  review.user_name ||
  review.reviewer_name ||
  "Verified buyer";

const formatReviewDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function RatingStars({ rating, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= rating;

        if (!interactive) {
          return (
            <Star
              key={starValue}
              size={15}
              className={isActive ? "fill-amber-400 text-amber-400" : "text-gray-200"}
            />
          );
        }

        return (
          <button
            key={starValue}
            type="button"
            aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
            onClick={() => onChange(starValue)}
            className="rounded-md p-0.5 transition hover:scale-110"
          >
            <Star
              size={22}
              className={isActive ? "fill-amber-400 text-amber-400" : "text-gray-300"}
            />
          </button>
        );
      })}
    </div>
  );
}

function ReviewForm({ productId, myReview, onLoginRequired }) {
  const [rating, setRating] = useState(Number(myReview?.rating) || 0);
  const [reviewText, setReviewText] = useState(myReview?.review || "");
  const createReview = useCreateReview(productId);
  const updateReview = useUpdateReview(productId);
  const deleteReview = useDeleteReview(productId);
  const isSaving = createReview.isPending || updateReview.isPending;
  const isDeleting = deleteReview.isPending;

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = reviewText.trim();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!text) {
      toast.error("Please write your review");
      return;
    }
    if (text.length > 100) {
      toast.error("Review must be 100 characters or fewer");
      return;
    }

    const onSuccess = (response) => {
      toast.success(response?.message || "Review saved successfully");
    };
    const onError = (error) => {
      toast.error(error.response?.data?.message || "Failed to save review");
    };

    if (myReview) {
      updateReview.mutate(
        { reviewId: myReview.id, rating, review: text },
        { onSuccess, onError },
      );
    } else {
      createReview.mutate({ rating, review: text }, { onSuccess, onError });
    }
  };

  const handleDelete = () => {
    if (!myReview || !window.confirm("Delete your review?")) return;

    deleteReview.mutate(myReview.id, {
      onSuccess: (response) => {
        toast.success(response?.message || "Review deleted successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete review");
      },
    });
  };

  if (!localStorage.getItem("accessToken")) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#4c2ed8]/20 bg-[#faf9ff] px-5 py-10 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1efff] text-[#4c2ed8]">
          <MessageSquare size={22} />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Share your experience</h3>
        <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
          Login to read and write reviews for this product.
        </p>
        <button
          type="button"
          onClick={onLoginRequired}
          className="mt-5 rounded-xl bg-[#4c2ed8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
        >
          Login to continue
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#4c2ed8]/10 bg-[#faf9ff] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {myReview ? "Update your review" : "Write a review"}
          </h3>
          <p className="mt-1 text-xs text-gray-500">Share what you liked about this product.</p>
        </div>
        {myReview && (
          <span className="rounded-full bg-[#f1efff] px-2.5 py-1 text-[10px] font-semibold text-[#4c2ed8]">
            Your review
          </span>
        )}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Rating</span>
        <RatingStars rating={rating} interactive onChange={setRating} />
        <span className="text-xs text-gray-400">{rating ? `${rating}/5` : "Select a rating"}</span>
      </div>

      <textarea
        value={reviewText}
        onChange={(event) => setReviewText(event.target.value)}
        maxLength={100}
        rows={4}
        placeholder="Write your review here..."
        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#4c2ed8] focus:ring-2 focus:ring-[#4c2ed8]/10"
      />
      <div className="mt-1 text-right text-[11px] text-gray-400">{reviewText.length}/100</div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
        {myReview && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={14} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#4c2ed8] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4c2ed8]/20 transition hover:bg-[#3a24b0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : myReview ? (
            <Check size={15} />
          ) : (
            <Send size={15} />
          )}
          {isSaving ? "Saving..." : myReview ? "Update review" : "Submit review"}
        </button>
      </div>
    </form>
  );
}

export default function ProductReviews({ productId, onLoginRequired }) {
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
  const { data, isLoading, isError, refetch } = useProductReviews(productId);
  const { data: myReviewData, isLoading: myReviewLoading } = useMyReview(productId);
  const reviews = data?.data?.reviews || [];
  const myReview = myReviewData?.data?.review || null;
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      reviews.length
    : 0;
  const ratingCounts = Array.from({ length: 5 }, (_, index) => {
    const rating = 5 - index;
    return reviews.filter((review) => Number(review.rating) === rating).length;
  });

  return (
    <section className="mt-8 rounded-[2rem] border border-[#4c2ed8]/10 bg-white p-5 shadow-[0_18px_50px_rgba(76,46,216,0.08)] sm:p-7 lg:p-8">
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4c2ed8]">Customer feedback</p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">Reviews & Ratings</h2>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RatingStars rating={Math.round(averageRating)} />
            <span className="font-semibold text-gray-800">{averageRating.toFixed(1)}</span>
            <span>({reviews.length})</span>
          </div>
        )}
      </div>

      {!isLoggedIn ? (
        <div className="mt-5 rounded-2xl border border-dashed border-[#4c2ed8]/20 bg-[#faf9ff] px-5 py-10 text-center">
          <MessageSquare className="mx-auto text-[#4c2ed8]" size={28} />
          <h3 className="mt-3 text-base font-semibold text-gray-900">Login to see customer reviews</h3>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
            Sign in to read verified customer feedback and share your own experience.
          </p>
          <button
            type="button"
            onClick={onLoginRequired}
            className="mt-5 rounded-xl bg-[#4c2ed8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
          >
            Login to continue
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)]">
          <div className="rounded-2xl bg-[#faf9ff] p-5">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-[#4c2ed8]">
                {averageRating ? averageRating.toFixed(1) : "—"}
              </span>
              <span className="pb-1 text-sm text-gray-500">out of 5</span>
            </div>
            <div className="mt-2">
              <RatingStars rating={Math.round(averageRating)} />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
            <div className="mt-5 space-y-2.5">
              {ratingCounts.map((count, index) => {
                const rating = 5 - index;
                const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-3">{rating}</span>
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="w-5 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex items-center gap-2 border-t border-[#4c2ed8]/10 pt-4 text-xs text-gray-500">
              <ShieldCheck size={15} className="text-[#4c2ed8]" />
              Verified customer feedback
            </div>
          </div>

          <div className="min-w-0">
            {myReviewLoading ? (
              <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
            ) : (
              <ReviewForm
                key={myReview?.id || "new-review"}
                productId={productId}
                myReview={myReview}
                onLoginRequired={onLoginRequired}
              />
            )}
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900">What customers said</h3>
            {isLoading && <span className="text-xs text-gray-400">Loading reviews...</span>}
          </div>
          {isError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-5 text-center">
              <p className="text-sm text-red-500">Unable to load reviews right now.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 text-sm font-semibold text-[#4c2ed8] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : reviews.length === 0 && !isLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 px-5 py-8 text-center text-sm text-gray-500">
              No reviews yet. Be the first to share your experience.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {reviews.map((review) => {
                const reviewerName = getReviewerName(review);
                const isCurrentUser =
                  myReview && Number(review.user_id) === Number(myReview.user_id);

                return (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1efff] text-xs font-bold text-[#4c2ed8]">
                          {isCurrentUser ? "Y" : reviewerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {isCurrentUser ? "You" : reviewerName}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {formatReviewDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <RatingStars rating={Number(review.rating)} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {review.review}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
