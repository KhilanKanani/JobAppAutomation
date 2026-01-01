import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "../main";
import { setHistory } from "../redux/Userslice";

const History = () => {
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.user);
  const [openEmail, setOpenEmail] = useState(null);
  const [loading, setloading] = useState(false);

  const fetchHistory = async () => {
    try {
      setloading(true);
      const res = await axios.get(`${SERVER_URL}/api/app/history`, { withCredentials: true });
      dispatch(setHistory(res?.data?.applications));
      setloading(false);
    }

    catch (err) {
      console.error("Failed to fetch subscription:", err);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Fetch history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Application History
          </h2>
          <p className="text-gray-500 mt-1">
            Track all job applications you’ve sent
          </p>
        </div>

        {/* EMPTY STATE */}
        {!history || history.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-md">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700">
              No applications yet
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Once you send applications, they will appear here
            </p>
          </div>
        ) : (
          /* GRID LIST */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {history.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6 flex flex-col justify-between"
              >
                {/* TOP */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {app.companyName}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {app.role || "Open / Internship Position"}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <p>📧 HR Email: {app.hrEmail}</p>
                    <p>
                      📅 Sent on{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${app.status === "sent"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {app.status.toUpperCase()}
                    </span>

                    {/* OPEN INFO */}
                    <div className="mb-4 text-xs font-semibold bg-gray-200 p-2 rounded-full  text-gray-500">
                      {app.open ? (
                        <p>
                          Opened on{" "}
                          {new Date(app.openAt).toLocaleString()}
                        </p>
                      ) : (
                        <p>Email not opened yet</p>
                      )}
                    </div>

                  </div>

                  <button
                    onClick={() => setOpenEmail(app._id)}
                    className="px-4 mt-2 py-2 text-sm cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View Email
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* EMAIL PREVIEW MODAL */}
        {openEmail && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative overflow-hidden">
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">
                  📬 Sent Email Preview
                </h3>
                <button
                  onClick={() => setOpenEmail(null)}
                  className="text-gray-500 cursor-pointer hover:text-gray-800 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div
                  className="prose max-w-none text-sm"
                  dangerouslySetInnerHTML={{
                    __html:
                      history.find((a) => a._id === openEmail)
                        ?.emailContent.replace(/\n/g, "<br/>") || "<p>No content available</p>",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History; 