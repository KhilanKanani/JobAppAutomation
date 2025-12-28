import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { SERVER_URL } from "../main";
import { setUserdata } from "../redux/Userslice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { userdata } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = userdata?.user;
    

    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setResumeUrl(user.resumeUrl || "");
        }
        setLoading(false);
    }, [user]);

    const handleSave = async () => {
        try {
            if (!name.trim()) {
                toast.error("Full name is required");
                return;
            }

            if (!resumeUrl && !resumeFile) {
                toast.error("Please upload your resume");
                return;
            }

            setSaving(true);
            const loadingToast = toast.loading("Saving profile...");

            const formData = new FormData();
            formData.append("name", name);
            if (resumeFile) formData.append("resume", resumeFile);

            const res = await axios.put(`${SERVER_URL}/api/user/editProfile`, formData, { withCredentials: true });
            dispatch(setUserdata({ user: res.data.user }));
            setResumeUrl(res.data.user.resumeUrl || "");
            setResumeFile(null);

            toast.success("Profile updated successfully", { id: loadingToast });
            setEdit(false);
        } catch (err) {
            toast.error("Profile update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 text-sm">Checking session...</p>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        try {
            await axios.post(`${SERVER_URL}/api/auth/logout`, {}, { withCredentials: true });
            dispatch(setUserdata(null));
            toast.success("Logout successful !")
            navigate("/");
        }

        catch (error) {
            console.error("Logout error:", error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                    {/*  HEADER  */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 p-6 border-b">
                        <div className="w-15 h-15 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                            {name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {name}
                            </h2>
                            <p className="text-gray-500 text-sm">{email}</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setEdit(!edit)}
                                className="px-5 py-2 cursor-pointer rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                {edit ? "Cancel" : "Edit Profile"}
                            </button>

                            <button
                                onClick={() => handleLogout()}
                                className="sm:block hidden px-5 py-2 cursor-pointer rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">

                        {/* BASIC INFO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-600">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    disabled={!edit}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full mt-1 px-4 py-2 rounded-lg border ${edit ? "focus:ring-2 focus:ring-blue-400" : "bg-gray-100 cursor-not-allowed"}`}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full mt-1 px-4 py-2 rounded-lg border bg-gray-100 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Email cannot be changed
                                </p>
                            </div>
                        </div>

                        {/* RESUME  */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Resume
                            </h3>

                            {/* VIEW MODE */}
                            {!edit && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-100 rounded-xl">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            {resumeUrl ? "Resume uploaded" : "No resume uploaded"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {resumeUrl
                                                ? "You can view your resume"
                                                : "Upload resume to apply faster"}
                                        </p>
                                    </div>

                                    {resumeUrl && (
                                        <a
                                            href={resumeUrl.replace("/upload/", "/upload/f_auto/")}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 cursor-pointer py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            View Resume
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* EDIT MODE */}
                            {edit && (
                                <div className="space-y-4">
                                    <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                                        <p className="text-sm font-medium text-blue-600">
                                            Click to upload resume
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PDF / DOC / DOCX (Max 5MB)
                                        </p>

                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={(e) => setResumeFile(e.target.files[0])}
                                        />
                                    </label>

                                    {resumeFile && (
                                        <div className="flex sm:flex-row flex-col gap-2 sm:items-center justify-between p-3 bg-gray-100 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {resumeFile.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setResumeFile(null)}
                                                className="text-sm text-red-500 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {edit && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full py-3 cursor-pointer bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save Profile"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;