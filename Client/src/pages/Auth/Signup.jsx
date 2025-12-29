import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../main";
import { useDispatch } from "react-redux";
import { setUserdata, setLoadings } from "../../redux/Userslice";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    dispatch(setLoadings(true));

    try {
      const emailRegex =
        /^(?=.{1,254}$)(?=.{1,64}@)(?:[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))*\.[a-z]{2,}$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email address format")
        return;
      }

      const res = await axios.post(`${SERVER_URL}/api/auth`, { name, email, password }, { withCredentials: true });
      dispatch(setUserdata(res.data));

      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 800);
    }

    catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Signup failed. Please try again."
      );
    }

    finally {
      dispatch(setLoadings(false));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 px-4 relative">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-gray-700 cursor-pointer hover:text-blue-600 transition"
      >
        ← Back
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mt-1">
          Job Application Automation
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* ✅ Button with Loading */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 rounded-lg font-medium transition ${loading
              ? "bg-blue-400 cursor-not-allowed animate-pulse"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
