import { useState } from "react";
import { users } from "../data/users";
import UserCard from "../components/UserCard";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";

const Home = () => {
  const publicUsers = users.filter((user) => user.isPublic);
  const [page, setPage] = useState(1);
  const usersPerPage = 5;

  const paginated = publicUsers.slice((page - 1) * usersPerPage, page * usersPerPage);
  const totalPages = Math.ceil(publicUsers.length / usersPerPage);

  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6">Public Profiles</h2>
        <div className="space-y-6">
          {paginated.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
        <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
      </main>
    </div>
  );
};

export default Home;
