import React, { useState, memo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserdata } from "../redux/Userslice";
import axios from "axios";
import { SERVER_URL } from "../main";
import { toast } from "sonner";

const Navbar = memo(() => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userdata } = useSelector((state) => state.user);
  const user = userdata?.user;
  const firstLetter = user?.name?.charAt(0)?.toUpperCase();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600 transition";

  const handleLogout = async () => {
    try {
      await axios.post(`${SERVER_URL}/api/auth/logout`, {}, { withCredentials: true });
      dispatch(setUserdata(null));
      toast.success("Logout successful !")
      setOpen(false);
      navigate("/");
    }

    catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="KkLogo.png" alt="KK Logo" className="h-13 w-auto" />
            <span className="text-lg font-bold text-gray-800 hidden sm:block">
              JobApply
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/send" className={navLinkClass}>Send Application</NavLink>
            <NavLink to="/history" className={navLinkClass}>History</NavLink>

            {/* User / Login */}
            {!user ? (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            ) : (
              <div
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold group-hover:bg-blue-700 transition">
                  {firstLetter}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden text-gray-700"
          >
            <span className="text-2xl">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden transition-all duration-300 overflow-hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } bg-white border-t`}
      >
        <div className="flex flex-col px-4 py-4 space-y-4">

          <NavLink onClick={() => setOpen(false)} to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/send" className={navLinkClass}>
            Send Application
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/history" className={navLinkClass}>
            History
          </NavLink>

          {!user ? (
            <Link
              onClick={() => setOpen(false)}
              to="/login"
              className="mt-2 text-center px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Login
            </Link>
          ) : (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
