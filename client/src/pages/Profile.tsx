import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: "",
    photo: user?.photo || "",
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: "weekends",
    isPublic: true,
  });

  const [newOffered, setNewOffered] = useState("");
  const [newWanted, setNewWanted] = useState("");

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const removeTag = (type: "skillsOffered" | "skillsWanted", index: number) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const addTag = (type: "skillsOffered" | "skillsWanted", value: string) => {
    if (value.trim() === "") return;
    setForm((prev) => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }));
    if (type === "skillsOffered") setNewOffered("");
    else setNewWanted("");
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/updateUserByEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, updates: form }),
      });
      if (res.ok) {
        alert("Profile updated!");
      } else {
        const errorData = await res.json();
        alert("Failed to update profile.\n" + errorData.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handleDiscard = () => {
    navigate("/home");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Profile Form */}
      <div className="max-w-4xl mx-auto p-6 bg-white mt-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold">Name</label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold">Location</label>
              <input
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold">Skills Offered</label>
              <div className="flex flex-wrap gap-2">
                {form.skillsOffered.map((skill, i) => (
                  <span key={i} className="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center">
                    {skill}
                    <button onClick={() => removeTag("skillsOffered", i)} className="ml-2 text-red-600 font-bold">×</button>
                  </span>
                ))}
              </div>
              <div className="flex mt-2 gap-2">
                <input
                  value={newOffered}
                  onChange={(e) => setNewOffered(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag("skillsOffered", newOffered)}
                  placeholder="Add skill"
                  className="border rounded px-2 py-1 flex-1"
                />
                <button onClick={() => addTag("skillsOffered", newOffered)} className="bg-sky-500 text-white px-3 py-1 rounded">Add</button>
              </div>
            </div>
            <div>
              <label className="block font-semibold">Availability</label>
              <input
                value={form.availability}
                onChange={(e) => handleChange("availability", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold">Profile</label>
              <select
                value={form.isPublic ? "Public" : "Private"}
                onChange={(e) => handleChange("isPublic", e.target.value === "Public")}
                className="w-full border rounded px-3 py-2"
              >
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div className="text-center">
              <img src={form.photo} className="w-32 h-32 rounded-full mx-auto" />
              <div className="mt-2 space-x-3 text-sm">
                <button className="text-blue-600 hover:underline">Add/Edit</button>
                <button onClick={() => handleChange("photo", "")} className="text-red-600 hover:underline">Remove</button>
              </div>
            </div>
            <div>
              <label className="block font-semibold">Skills Wanted</label>
              <div className="flex flex-wrap gap-2">
                {form.skillsWanted.map((skill, i) => (
                  <span key={i} className="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center">
                    {skill}
                    <button onClick={() => removeTag("skillsWanted", i)} className="ml-2 text-red-600 font-bold">×</button>
                  </span>
                ))}
              </div>
              <div className="flex mt-2 gap-2">
                <input
                  value={newWanted}
                  onChange={(e) => setNewWanted(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag("skillsWanted", newWanted)}
                  placeholder="Add skill"
                  className="border rounded px-2 py-1 flex-1"
                />
                <button onClick={() => addTag("skillsWanted", newWanted)} className="bg-sky-500 text-white px-3 py-1 rounded">Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Save
          </button>
          <button onClick={handleDiscard} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
