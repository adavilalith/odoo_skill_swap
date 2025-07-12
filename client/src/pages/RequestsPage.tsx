import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/Navbar";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface Request {
  _id: string;
  senderEmail: string;
  receiverEmail: string;
  providedSkill: string;
  requestedSkill: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  senderProfile: {
    name: string;
    photo: string;
    rating?: number;
  };
}

const Requests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState<Request[]>([]);
  const [filterStatus, setFilterStatus] = useState<"pending" | "accepted" | "rejected" | "All">("All");
  const [filterType, setFilterType] = useState<"sent" | "received" | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const requestsPerPage = 5;

  const fetchRequests = async () => {
    const res = await fetch(`/api/getRequestsByEmail?email=${user?.email}`);
    const data = await res.json();
    setRequests([...data.received, ...data.sent]);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchRequests();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      const res = await fetch("/api/deleteRequestById", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id }),
      });
      if (res.ok) {
        fetchRequests(); // refresh
      } else {
        alert("Failed to delete request.");
      }
    } catch (err) {
      console.error("Failed to delete request", err);
    }
  };


  const updateStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      await fetch("/api/updateRequestStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id, status }),
      });
      fetchRequests();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const filtered = requests
    .filter((r) => filterStatus === "All" || r.status === filterStatus)
    .filter((r) =>
      filterType === "All"
        ? true
        : filterType === "sent"
        ? r.senderEmail === user?.email
        : r.receiverEmail === user?.email
    )
    .filter((r) =>
      search.trim() === "" ? true : r.senderProfile?.name?.toLowerCase().includes(search.toLowerCase())
    );

  const paginated = filtered.slice((page - 1) * requestsPerPage, page * requestsPerPage);
  const totalPages = Math.ceil(filtered.length / requestsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <UserNavbar />

      <div className="max-w-5xl mx-auto p-6">
        {/* Filters + Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <select
              className="border px-3 py-1 rounded"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="border px-3 py-1 rounded"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="All">All Requests</option>
              <option value="received">Received</option>
              <option value="sent">Sent</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRequests}
              title="Refresh"
              className="p-2 rounded-full bg-white border hover:bg-gray-100"
            >
              <ArrowPathIcon className="h-5 w-5 text-blue-600" />
            </button>
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-1 rounded"
            />
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {paginated.map((req) => (
            <div key={req._id} className="flex justify-between items-center p-4 bg-white rounded shadow">
              <div className="flex items-center gap-4">
                <img src={req.senderProfile?.photo || "https://i.pravatar.cc/80"} className="w-16 h-16 rounded-full" />
                <div>
                  <h2 className="text-lg font-bold">{req.senderProfile?.name}</h2>
                  <p className="text-sm text-gray-600">
                    Rating: {req.senderProfile?.rating?.toFixed(1) || "3.9"}/5
                  </p>
                  <div className="text-sm mt-2">
                    <span className="text-green-600 font-medium">Skills Offered ➝</span>{" "}
                    <span className="bg-gray-200 px-2 py-0.5 rounded">{req.providedSkill}</span>
                    <br />
                    <span className="text-blue-600 font-medium">Skills Wanted ➝</span>{" "}
                    <span className="bg-gray-200 px-2 py-0.5 rounded">{req.requestedSkill}</span>
                    <br />
                    <span className="text-gray-600">{req.message}</span>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="text-md">
                  <span className="font-bold">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      req.status === "pending"
                        ? "text-gray-500"
                        : req.status === "accepted"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                {req.receiverEmail === user?.email && req.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(req._id, "accepted")}
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(req._id, "rejected")}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Reject
                    </button>
                    
                    
                  </div>
                )}
                {req.receiverEmail === user?.email && req.status !== "accepted" && (
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="text-gray-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                )}
              </div>
            </div>
          ))}
          
          
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-3 text-lg">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded ${
                num === page ? "bg-blue-600 text-white" : "text-blue-600 hover:underline"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Requests;
