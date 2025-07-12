// src/components/ReviewForm.tsx
import { useState } from "react";

const ReviewForm = ({
  onSubmit,
}: {
  onSubmit: (rating: number, text: string) => void;
}) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5 || text.trim() === "") return;
    onSubmit(rating, text.trim());
    setRating(0);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow border space-y-3 mt-6">
      <h3 className="font-bold">Leave a Review</h3>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((r) => (
          <span
            key={r}
            className={`cursor-pointer text-2xl ${
              rating >= r ? "text-yellow-500" : "text-gray-300"
            }`}
            onClick={() => setRating(r)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        className="w-full border rounded p-2 text-sm"
        rows={3}
        placeholder="Write your review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;
