import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import UserNavbar from "../components/Navbar";

interface LocationState {
  receiverEmail: string;
  receiverName: string;
  receiverPhoto: string;
  receiverSkillsWanted: string[];
}

const SendRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    receiverEmail,
    receiverName,
    receiverPhoto,
    receiverSkillsWanted,
  } = location.state as LocationState;

  const [providedSkill, setProvidedSkill] = useState("");
  const [requestedSkill, setRequestedSkill] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/sendRequestByEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: user?.email,
          receiverEmail,
          providedSkill,
          requestedSkill,
          message,
        }),
      });

      if (res.ok) {
        alert("Request sent!");
        navigate("/requests");
      } else {
        const error = await res.json();
        alert("Error: " + error?.message || "Failed to send request");
      }
    } catch (err) {
      console.error("Send request error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
        <div className="text-center mb-4">
          <img
            src={receiverPhoto}
            alt="Receiver"
            className="w-24 h-24 mx-auto rounded-full"
          />
          <h2 className="mt-2 text-xl font-bold">{receiverName}</h2>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Choose one of your offered skills
          </label>
          <select
            value={providedSkill}
            onChange={(e) => setProvidedSkill(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select --</option>
            {user?.skillsOffered?.map((skill, idx) => (
              <option key={idx} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Choose one of their wanted skills
          </label>
          <select
            value={requestedSkill}
            onChange={(e) => setRequestedSkill(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select --</option>
            {receiverSkillsWanted.map((skill, idx) => (
              <option key={idx} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border px-3 py-2 rounded h-24 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SendRequest;
