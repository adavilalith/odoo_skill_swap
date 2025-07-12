import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserProfile } from "../types";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

interface Review {
  reviewerEmail: string;
  reviewerName: string;
  rating: number;
  text: string;
  timestamp: string;
}

const UserPage = () => {
  const { state } = useLocation();
  const { isLoggedIn, user: authUser } = useAuth();
  const navigate = useNavigate();

  const user: UserProfile = state?.user;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/getReviewsByUser?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => setReviews(data.reviews || []));
    }

    if (isLoggedIn && authUser?.email && user?.email && authUser.email !== user.email) {
      fetch(`/api/hasAcceptedRequest?sender=${authUser.email}&receiver=${user.email}`)
        .then((res) => res.json())
        .then((data) => setCanReview(data.allowed));
    }
  }, [user?.email, authUser?.email, isLoggedIn]);

  const handleSubmitReview = async () => {
    if (!text.trim()) return alert("Review cannot be empty");

    const res = await fetch("/api/addReview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewerEmail: authUser?.email,
        reviewedEmail: user.email,
        rating,
        text,
      }),
    });

    if (res.ok) {
      setText("");
      setRating(5);
      const updated = await fetch(`/api/getReviewsByUser?email=${user.email}`);
      const data = await updated.json();
      setReviews(data.reviews || []);
    } else {
      alert("Failed to submit review");
    }
  };

  if (!user) {
    return <div className="p-6">User not found.</div>;
  }

  const handleRequest = (user: UserProfile) => {
    if (!isLoggedIn) {
      alert("Please log in to send a request.");
      navigate("/login");
      return;
    }

    navigate("/send-request", {
      state: {
        receiverEmail: user.email,
        receiverName: user.name,
        receiverPhoto: user.photo,
        receiverSkillsWanted: user.skillsWanted,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 mt-6 bg-white shadow rounded">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <img
            src={user.photo}
            alt={user.name}
            className="w-32  h-32 rounded-full object-cover"
          />
        </div>
          <h2 className="text-2xl ">{user.email}</h2>

        <div className="mt-6 space-y-4">
          <div>
            <h2 className="font-semibold">Skills Offered:</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.skillsOffered.map((skill, i) => (
                <span key={i} className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold">Skills Wanted:</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.skillsWanted.map((skill, i) => (
                <span key={i} className="bg-red-100 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold">Rating:</h2>
            <p>{user.rating || "Not rated yet"}</p>
          </div>

          <button
            onClick={() => handleRequest(user)}
            className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600"
          >
            Request
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow rounded space-y-4">
        <h2 className="text-xl font-bold">Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          reviews.map((rev, i) => (
            <div key={i} className="border-b pb-3 mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{rev.reviewerName}</span>
                <span className="text-yellow-600 font-medium">{rev.rating} ★</span>
              </div>
              <p className="text-gray-700 mt-1">{rev.text}</p>
              <p className="text-gray-400 text-sm">{new Date(rev.timestamp).toLocaleDateString()}</p>
            </div>
          ))
        )}

        {/* Add Review (if allowed) */}
        {isLoggedIn && authUser?.email !== user.email && canReview && (
          <div className="pt-4 border-t space-y-2">
            <h3 className="font-semibold text-lg">Add Your Review</h3>
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
            />
            <textarea
              rows={3}
              placeholder="Write your review..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <button
              onClick={handleSubmitReview}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
