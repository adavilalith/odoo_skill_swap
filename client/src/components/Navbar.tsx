import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold text-odoo-primary">
        <Link to="/">Skill Swap</Link>
      </h1>

      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <>
           <Link to="/" className="text-gray-700 hover:text-odoo-primary">
              Home
            </Link>
          <Link to="/login" className="text-odoo-primary font-semibold">
            Login
          </Link>
          </>
        ) : (
          <>
            <Link to="/requests" className="text-gray-700 hover:text-odoo-primary">
              Swap Requests
            </Link>
            <Link to="/" className="text-gray-700 hover:text-odoo-primary">
              Home
            </Link>
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300"
              title={user?.email}
            >
              {user?.email?.charAt(0).toUpperCase()}
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
