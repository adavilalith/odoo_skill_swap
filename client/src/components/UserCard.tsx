// src/components/UserCard.tsx
import { useNavigate } from "react-router-dom";
import type { UserProfile } from "../types";

interface Props {
  user: UserProfile;
  isLoggedIn: boolean;
}

export const UserCard = ({ user, isLoggedIn }: Props) => {
  const navigate = useNavigate();

  const handleRequest = (e: React.MouseEvent,user:UserProfile) => {
    e.stopPropagation();
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

  const goToUserPage = () => {
    navigate(`/user/${user.id}`, { state: { user } });
  };

  return (
    <div
      className="border p-4 rounded shadow hover:shadow-md transition cursor-pointer"
      onClick={goToUserPage}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{user.name}</h2>
        <img
          src={user.photo}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      <p className="text-sm mt-2 font-semibold">Skills Offered:</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {user.skillsOffered.map((skill, i) => (
          <span key={i} className="bg-blue-100 text-sm px-2 py-1 rounded-full">
            {skill}
          </span>
        ))}
      </div>
      <p className="text-sm mt-2 font-semibold">Skills Wanted:</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {user.skillsWanted.map((skill, i) => (
          <span key={i} className="bg-red-100 text-sm px-2 py-1 rounded-full">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">Rating: {user.rating}</p>
        <button
            onClick={(e) => handleRequest(e,user)}
            className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600"
          >
            Request
        </button>
      </div>
    </div>
  );
};
