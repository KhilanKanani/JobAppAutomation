import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "../main";
import { setHistory } from "../redux/Userslice";
import { useState } from "react";

const FetchHistory = () => {
    const dispatch = useDispatch();
    const [loading, setloading] = useState(false);

    useEffect(() => {
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

        fetchHistory();
    }, []);

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
}

export default FetchHistory
