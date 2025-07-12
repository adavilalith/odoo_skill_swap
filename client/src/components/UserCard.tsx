import { useAuth } from "../context/AuthContext";
import type { UserProfile } from "../data/users";

const UserCard = ({ user }: { user: UserProfile }) => {
  const { isLoggedIn } = useAuth();

  const handleRequest = () => {
    if (!isLoggedIn) {
      alert("Please log in to send a request.");
    } else {
      alert(`Request sent to ${user.name}!`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4 items-center">
      <img src={user.photo} alt={user.name} className="w-20 h-20 rounded-full" />
      <div className="flex-1">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-sm text-green-700">
          Skills Offered ⇒ {user.skillsOffered.join(", ")}
        </p>
        <p className="text-sm text-blue-700">
          Skills Wanted ⇒ {user.skillsWanted.join(", ")}
        </p>
        <p className="text-sm mt-1 text-gray-600">Rating: {user.rating.toFixed(1)}/5</p>
      </div>
      <button
        onClick={handleRequest}
        className="bg-sky-400 text-white px-4 py-2 rounded hover:bg-sky-500"
      >
        Request
      </button>
    </div>
  );
};

export default UserCard;
