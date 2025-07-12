// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { UserCard } from "../components/UserCard";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import type { UserProfile } from "../types";

const Home = () => {
  const { isLoggedIn } = useAuth();
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
        setUsers(data.users);
        setTotal(data.total);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Explore Users</h1>

        <div className="space-y-6">
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
