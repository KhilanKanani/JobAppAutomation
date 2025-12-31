import React, { useState } from "react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "../main";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

const SendApplication = () => {
  const { userdata } = useSelector((state) => state.user);
  const user = userdata?.user;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fullName] = useState(user?.name || "");
  const [userEmail] = useState(user?.email || "");
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hrEmail, setHrEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.resumeUrl) {
      toast.error("Please upload resume in profile first");
      return;
    }

    // Validate email format
    const emailRegex =
      /^(?=.{1,254}$)(?=.{1,64}@)(?:[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))*\.[a-z]{2,}$/;

    if (!emailRegex.test(hrEmail)) {
      toast.error("Invalid HR email address format");
      return;
    }


    let toastId;
    let timer;

    try {
      setLoading(true);
      toastId = toast.loading("Sending application...");

      timer = setTimeout(() => {
        toast.loading("Generating a personalized email…", { id: toastId });
      }, 3000);

      const res = await axios.post(`${SERVER_URL}/api/app/send`,
        {
          fullName,
          email: userEmail,
          role,
          companyName,
          hrEmail,
          resumeUrl: user.resumeUrl,
        }, { withCredentials: true });

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: hrEmail,
          user_email: userEmail,
          subject : res?.data?.subject,
          emailData: res?.data?.plainText
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success("Application sent successfully", { id: toastId });

      setRole("");
      setCompanyName("");
      setHrEmail("");
    }

    catch (err) {
      toast.error(err.response?.data?.message || "Failed to send application", { id: toastId });
      console.error("Failed to send application:", err);
    }

    finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">

          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Send Job Application
            </h2>
            <p className="mt-1 text-gray-500 text-sm sm:text-base">
              Automatically send a professional email to HR
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            {/* READ-ONLY INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  disabled
                  className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Your Email</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            {/* INPUT FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-600">
                  Job Role <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Frontend Developer"
                  value={role}
                  disabled={loading}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${loading && "bg-gray-100"}`}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${loading && "bg-gray-100"}`}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                HR Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="hr@company.com"
                value={hrEmail}
                onChange={(e) => setHrEmail(e.target.value)}
                className={`w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${loading && "bg-gray-100"}`}
              />
            </div>

            {/* RESUME CARD */}
            <div className="bg-gray-50 border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {user?.resumeUrl ? "Resume Attached" : "No Resume Found"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.resumeUrl
                    ? "Using resume from your profile"
                    : "Upload resume to apply faster"}
                </p>
              </div>

              {user?.resumeUrl ? (
                <a
                  href={user.resumeUrl.replace("/upload/", "/upload/f_auto/")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  View Resume →
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Upload Resume
                </button>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading || !user?.resumeUrl}
              className="w-full py-3 cursor-pointer bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Application"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SendApplication;