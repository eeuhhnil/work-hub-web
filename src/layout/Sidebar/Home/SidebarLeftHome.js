import { useState, useEffect } from "react";
import Calendar from "~/pages/calender";

function SidebarLeftHome() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await fetch("http://localhost:3000/users/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch profile");
                }

                setUser(data.data);
                localStorage.setItem("user_avatar", data.data.avatar || ""); // ✅ cache avatar

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const cachedAvatar = localStorage.getItem("user_avatar") || "";

    return (
        <div className="max-w-[280px] w-full border-r border-color">
            <div className="flex flex-col items-center p-4">
        <span className="relative flex shrink-0 rounded-full w-[66px] h-[66px] cursor-pointer">
          <img
              className="aspect-square h-full w-full rounded-full"
              src={cachedAvatar || "/default-avatar.png"}
              alt="User avatar"
              onError={(e) => e.currentTarget.src = "/default-avatar.png"}
          />
        </span>

                {/* Hiển thị tên và email từ API */}
                {loading ? (
                    <p className="mt-2 text-gray-400">Loading...</p>
                ) : error ? (
                    <p className="mt-2 text-red-500">{error}</p>
                ) : user ? (
                    <>
                        <p className="mt-2 font-semibold">{user.fullName}</p>
                        <p className="text-gray-400 text-[1rem]">{user.email}</p>
                    </>
                ) : (
                    <p className="mt-2 text-gray-400">No user data</p>
                )}
            </div>

            <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>
            <Calendar />

            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div>Upcoming Events</div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-calendar w-4 h-4"
                    >
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                    </svg>
                </div>
                <div className="text-muted-foreground text-sm">All events for the next 7 days.</div>
            </div>
        </div>
    );
}

export default SidebarLeftHome;
