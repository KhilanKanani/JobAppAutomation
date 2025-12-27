import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import FetchHistory from "../fetchUserdata/FetchHistory";

const History = () => {
  FetchHistory();
  const { history } = useSelector((state) => state.user);
  const [openEmail, setOpenEmail] = useState(null);

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

                {/* BOTTOM */}
                <div className="mt-5 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === "sent"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {app.status.toUpperCase()}
                  </span>

                  <button
                    onClick={() =>
                      setOpenEmail(app._id)
                    }
                    className="px-4 py-2 text-sm cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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