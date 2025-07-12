import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

interface UserInfo {
  name: string;
  email: string;
  photo: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
}

const Profile = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) {
      navigate("/"); 
      return;
    }

    const fetchUserInfo = async () => {
      setLoading(true);

      // Simulate API call
      const response = await new Promise<UserInfo>((resolve) => {
        setTimeout(() => {
          resolve({
            name: "Marc Demo",
            email: user.email,
            photo: "https://i.pravatar.cc/100?u=" + user.email,
            skillsOffered: ["JavaScript", "Python"],
            skillsWanted: ["Photoshop", "Graphic designer"],
            rating: 4.2,
          });
        }, 1000);
      });

      setUserInfo(response);
      setLoading(false);
    };

    fetchUserInfo();
  }, [user?.email, navigate]);

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        {loading ? (
          <p>Loading your profile...</p>
        ) : userInfo ? (
          <div className="bg-white rounded-lg shadow-md p-6 flex gap-6 items-center">
            <img
              src={userInfo.photo}
              alt={userInfo.name}
              className="w-24 h-24 rounded-full border"
            />
            <div>
              <h2 className="text-xl font-semibold">{userInfo.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{userInfo.email}</p>
              <p className="text-sm text-green-700">
                Skills Offered ⇒ {userInfo.skillsOffered.join(", ")}
              </p>
              <p className="text-sm text-blue-700">
                Skills Wanted ⇒ {userInfo.skillsWanted.join(", ")}
              </p>
              <p className="text-sm mt-1 text-gray-600">
                Rating: {userInfo.rating.toFixed(1)} / 5
              </p>
            </div>
          </div>
        ) : (
          <p className="text-red-500">User info not found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
