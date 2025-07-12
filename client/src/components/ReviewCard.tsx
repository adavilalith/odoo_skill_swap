// src/components/ReviewCard.tsx
import type { Review } from "../types";

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="bg-white p-4 rounded shadow-sm space-y-1 border">
      <div className="font-semibold">{review.reviewerName}</div>
      <div className="text-yellow-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
      <div className="text-gray-700 text-sm">{review.text}</div>
    </div>
  );
};

export default ReviewCard;
