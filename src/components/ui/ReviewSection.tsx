import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FiSend,
  FiLoader,
  FiSmile,
  FiFrown,
  FiMeh,
  FiStar,
} from "react-icons/fi";
import { auth, db } from "../../config/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";

interface Review {
  id: string;
  userId: string;
  userEmail: string;
  feedback: string;
  sentiment: string;
  rating: number;
  createdAt: string;
}

const FeedbackReviews = () => {
  const currentUser = auth.currentUser;
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!db) return;
    setReviewsLoading(true);

    let q;
    if (currentUser) {
      q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const reviewsData: Review[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          reviewsData.push({
            id: doc.id,
            userId: data.userId,
            userEmail: data.userEmail,
            feedback: data.feedback,
            sentiment: data.sentiment,
            rating: data.rating,
            createdAt: data.createdAt,
          });
        });
        setReviews(reviewsData);
        setReviewsLoading(false);
      },
      (error) => {
        console.error("Error fetching reviews:", error);
        setReviewsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleSubmitFeedback = async () => {
    if (!currentUser) {
      showAlert(
        "Authentication Required",
        "Please sign in to submit feedback.",
        "warning"
      );
      return;
    }

    if (!feedback.trim()) {
      showAlert(
        "Empty Feedback",
        "Please enter your feedback before submitting.",
        "warning"
      );
      return;
    }

    if (rating < 1) {
      showAlert("No Rating", "Please select a star rating.", "warning");
      return;
    }

    setLoading(true);
    try {
      const { sentiment } = await analyzeSentiment(feedback);

      await saveReview({
        feedback,
        sentiment,
        rating: clampRating(rating),
      });

      showSuccessAlert(sentiment, rating);
      setFeedback("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showAlert(
        "Error",
        "Failed to submit feedback. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const analyzeSentiment = async (text: string) => {
    const response = await fetch(
      "https://malruwan-sentiment-analysis.hf.space/predict-sentiment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok)
      throw new Error(`Sentiment API Error: ${response.status}`);
    const prediction = await response.json();

    return {
      sentiment: prediction?.sentiment || "Neutral",
    };
  };

  const saveReview = async (reviewData: {
    feedback: string;
    sentiment: string;
    rating: number;
  }) => {
    if (!currentUser) return;

    const fullReview = {
      userId: currentUser.uid,
      userEmail: currentUser.email || "",
      ...reviewData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(db, "reviews"), fullReview);
  };

  const showAlert = (title: string, text: string, icon: any) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "OK",
      background: "#1f2937",
      color: "#FFFFFF",
      confirmButtonColor: "#EF4444",
    });
  };

  const showSuccessAlert = (sentiment: string, rating: number) => {
    const { emoji, color } = getSentimentEmojiAndColor(sentiment);
    const starsHTML = getStarsHTML(rating);

    Swal.fire({
      title: "Feedback Submitted!",
      html: `
        <div style="text-align: center;">
          <div style="font-size: 50px; margin-bottom: 10px;">${emoji}</div>
          <p class="text-lg font-semibold mb-1 ${color}">${sentiment}</p>
          ${
            rating > 0
              ? `
            <div style="margin-top: 10px;">
              ${starsHTML}
              <div style="margin-top:5px;color:#34d399;">${rating}.0 Rating</div>
            </div>
          `
              : ""
          }
        </div>
      `,
      background: "#1f2937",
      color: "#FFFFFF",
      confirmButtonText: "OK",
      confirmButtonColor: "#10B981",
    });
  };

  const getSentimentEmojiAndColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return { emoji: "😊", color: "text-green-400" };
      case "Negative":
        return { emoji: "😞", color: "text-red-400" };
      default:
        return { emoji: "😐", color: "text-yellow-400" };
    }
  };

  const getStarsHTML = (rating: number) => {
    return Array(5)
      .fill(0)
      .map(
        (_, i) =>
          `<span style="color: ${
            i < rating ? "#facc15" : "#9ca3af"
          }; font-size: 20px;">★</span>`
      )
      .join("");
  };

  const clampRating = (value: number) => Math.max(0, Math.min(5, value));

  const formatDate = (timestamp: any) => {
    try {
      if (!timestamp?.toDate) return "Just now";
      return timestamp.toDate().toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-900/30 border-green-700";
      case "Negative":
        return "bg-red-900/30 border-red-700";
      default:
        return "bg-yellow-900/30 border-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center p-4">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-8 max-w-4xl w-full border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">
            Feedback Reviews
          </h1>
          <p className="text-gray-400">
            Share your thoughts and get instant sentiment analysis
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Feedback Form */}
          <div className="flex-1">
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">
                Your Feedback
              </label>
              <textarea
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-gray-100 placeholder-gray-400"
                rows={5}
                placeholder="Type your feedback, review, or comment here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{feedback.length}/1000 characters</span>
                <span>
                  {feedback.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">
                Your Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none hover:scale-110 transition-transform"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <FiStar
                      className={`w-8 h-8 transition-colors duration-200 ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>
                  {rating > 0
                    ? `You rated this ${rating} star${rating > 1 ? "s" : ""}`
                    : "Click to rate"}
                </span>
                {rating > 0 && (
                  <span className="text-emerald-400">{rating}.0 rating</span>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmitFeedback}
              disabled={loading}
              className={`w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                loading
                  ? "opacity-80"
                  : "hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20"
              }`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FiSend />
                  Submit Feedback
                </>
              )}
            </button>
          </div>

          {/* Reviews List */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">
              {currentUser ? "Your Feedback History" : "Recent Feedback"}
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {reviewsLoading ? (
                <div className="flex justify-center py-4">
                  <FiLoader className="animate-spin text-gray-400 text-xl" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No feedback submitted yet
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className={`p-4 rounded-lg border ${getSentimentColor(
                      review.sentiment
                    )}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-200">
                          {review.userEmail}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-500"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-emerald-400">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">{review.feedback}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${getSentimentColor(
                          review.sentiment
                        )}`}
                      >
                        {review.sentiment}
                      </span>
                      {review.sentiment === "Positive" ? (
                        <FiSmile className="text-green-400" />
                      ) : review.sentiment === "Negative" ? (
                        <FiFrown className="text-red-400" />
                      ) : (
                        <FiMeh className="text-yellow-400" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackReviews;