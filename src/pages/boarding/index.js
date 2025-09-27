import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SpaceCard from "~/components/SpaceCard";
import { API_CONFIG, apiRequest } from "~/config/api";

function Boarding() {
    const [listSpaces, setListSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        const handleGoogleCallback = async (code) => {
            try {
                const response = await fetch(
                    `${API_CONFIG.BASE_URL}/auth/google/callback?code=${code}`,
                    { method: "GET", credentials: "include" }
                );

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Lỗi callback");

                const { access_token, refresh_token } = data.data;
                if (!access_token || !refresh_token) throw new Error("Thiếu token trả về");

                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);

                await fetchSpaces(access_token); // truyền token trực tiếp
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchSpaces = async (token) => {
            try {
                const data = await apiRequest(API_CONFIG.ENDPOINTS.SPACES.LIST, {
                    method: "GET",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                setListSpaces(
                    data.data
                        .filter(space => space != null) // Filter out null spaces
                        .map((space) => ({
                            id: space._id || space.id || "",
                            name: space.name || "Unnamed space",
                        }))
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            handleGoogleCallback(code);
        } else {
            const token = localStorage.getItem("access_token");
            fetchSpaces(token);
        }
    }, []);

    const handleSelectSpace = (space) => {
        if (!space || !space.id) return; // an toàn
        localStorage.setItem("selectedSpace", JSON.stringify(space));
        navigate(`/space/${space.id}`);
    };


    return (
        <div className="w-full min-h-screen flex flex-col background-primary">
            <div className="w-full max-w-[500px] m-auto space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">Select space</h3>
                    <Link to="/boarding/new">
                        <button className="text-[#18181b] text-[14px] items-center rounded-md inline-flex bg-white py-2 px-4">
                            + Create space
                        </button>
                    </Link>
                </div>
                <p className="text-[#a1a1aa] text-[14px]">Select space to continue...</p>
                <div className="flex flex-col space-y-6">
                    {loading ? (
                        <p className="text-white text-[16px]">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : listSpaces.length === 0 ? (
                        <p className="text-white text-[16px]">No space created</p>
                    ) : (
                        listSpaces.map((space) => (
                            <div
                                key={space.id}
                                className="border border-color rounded-md cursor-pointer hover:bg-gray-700 transition"
                                onClick={() => handleSelectSpace(space)}
                            >
                                <SpaceCard space={space} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Boarding;