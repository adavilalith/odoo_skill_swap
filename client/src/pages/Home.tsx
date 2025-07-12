// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { UserCard } from "../components/UserCard";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import type { UserProfile } from "../types";

const Home = () => {
  const { isLoggedIn, user } = useAuth(); // access logged in user
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      const offset = (page - 1) * usersPerPage;
      try {
        const res = await fetch(`/api/getUsers?limit=${usersPerPage}&offset=${offset}`);
        const data = await res.json();

        const filtered = user
          ? data.users.filter((u: UserProfile) => u.email !== user.email)
          : data.users;

        setUsers(filtered);
        setTotal(data.total - (user ? 1 : 0)); // adjust total if user is excluded
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [page, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Explore Users</h1>

        <div className="space-y-6 max-w-2xl mx-auto">
        {users.map((user) => (
          <UserCard key={user.id} user={user} isLoggedIn={isLoggedIn} />
        ))}
      </div>

        <Pagination
          total={total}
          page={page}
          usersPerPage={usersPerPage}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Home;
