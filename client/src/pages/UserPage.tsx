// src/pages/UserPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserProfile } from "../types";
import Navbar from "../components/Navbar";

const UserPage = () => {
  const { state } = useLocation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const user: UserProfile = state?.user;

  if (!user) {
    return <div className="p-6">User not found.</div>;
  }

  const handleRequest = () => {
    alert(isLoggedIn ? "Request sent!" : "Please log in first.");
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
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

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
            <p>{user.rating}</p>
          </div>

          <button
            onClick={handleRequest}
            className="mt-4 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
          >
            Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
