import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../main";
import { useDispatch } from "react-redux";
import { setUserdata, setLoadings } from "../../redux/Userslice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setLoadings(true));
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, { email, password }, { withCredentials: true });
      dispatch(setUserdata(res.data));


      setMessage({
        type: "success",
        text: "Login successful!",
      });

      setTimeout(() => {
        navigate("/");
      }, 800);
    }

    catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Invalid email or password",
      });
    }

    finally {
      dispatch(setLoadings(false));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 relative">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-gray-700 cursor-pointer hover:text-blue-600 transition"
      >
        ← Back
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mt-1">
          Login to Job Application Automation
        </p>

        {/* ✅ Message */}
        {message.text && (
          <div
            className={`mt-4 text-sm text-center px-4 py-2 rounded-lg ${message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
