import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar />

      {/*  HERO  */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-16 md:pb-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
        <div className="md:text-left">
          <span className="inline-block mb-4 px-4 py-1 text-xs sm:text-sm bg-blue-100 text-blue-600 rounded-full">
            Job Application Automation
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Automate Your{" "}
            <span className="text-blue-600">Job Applications</span>
          </h1>

          <p className="mt-5 text-gray-600 text-base sm:text-lg leading-relaxed">
            Automatically send professional job application emails to HR,
            save time, and manage your application history in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/send")}
              className="w-full sm:w-auto cursor-pointer px-7 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
            >
              Send Application
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto cursor-pointer px-7 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition font-semibold"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Hide image on very small screens */}
        <div className="hidden sm:flex justify-center">
          <img
            src="https://illustrations.popsy.co/gray/work-from-home.svg"
            alt="Job Automation"
            className="w-full max-w-sm md:max-w-md"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      {/*  AUTOMATION FLOW  */}
      <section className="py-16 md:py-20 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            How the Automation Works
          </h2>

          <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Simple steps that fully automate your job applications.
          </p>

          <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: "1",
                title: "Enter Details",
                desc: "Add company name, HR email, job role, and resume.",
              },
              {
                step: "2",
                title: "Auto Email",
                desc: "System generates and sends email automatically.",
              },
              {
                step: "3",
                title: "Save History",
                desc: "Application details are saved for tracking.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-6 md:p-8 bg-white rounded-2xl border hover:shadow-lg transition"
              >
                <span className="absolute -top-4 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Step {item.step}
                </span>

                <h3 className="mt-4 text-lg md:text-xl font-semibold text-blue-600">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600 text-sm md:text-base">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  ABOUT (UPDATED)  */}
      <section className="py-16 md:py-20 max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          About This Platform
        </h2>

        <p className="mt-5 text-gray-600 text-sm sm:text-lg leading-relaxed">
          This automation platform is developed by <b>Khilan Kanani</b>,
          a MERN Stack Developer. The goal is to simplify the job application
          process by automating email sending, securely storing application
          history, and providing a clean, user-friendly experience for job seekers.
        </p>
      </section>

      {/*  FOOTER (UPDATED LAST DATA)  */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center">
        <p className="text-xs sm:text-sm">
          © {new Date().getFullYear()} KK Pvt Ltd • Automation Solutions
        </p>
      </footer>
    </div>
  );
};

export default Home;
