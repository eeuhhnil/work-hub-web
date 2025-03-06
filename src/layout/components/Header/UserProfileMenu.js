import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";


function UserProfileMenu() {
  const { spaceId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch("http://localhost:3002/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log(data.data.avatar);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setUser(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
      <RadixDropdownMenu.Root>
        <RadixDropdownMenu.Trigger>
          <button className="h-[32px] w-[32px]">
            <img className="rounded-full" src={user?.avatar} alt="User" />
          </button>
        </RadixDropdownMenu.Trigger>
        <RadixDropdownMenu.Content className="background-primary border border-color rounded-md w-56 transform -translate-x-4">
          <div className="px-2 py-1.5">
            {loading ? (
                <p className="text-sm text-gray-400">Loading...</p>
            ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
            ) : user ? (
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.fullName}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
            ) : (
                <p className="text-sm text-gray-400">No user data</p>
            )}
          </div>

          <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>
          <Link to={`/space/${spaceId}/profile`} className="flex items-center px-2 py-1.5">Profile</Link>
          <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>
          <div className="flex items-center px-2 py-1.5">Account Setting</div>
          <div className="flex items-center px-2 py-1.5">Switch Space</div>
          <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>

          <div className="flex items-center px-2 py-1.5 cursor-pointer text-red-500" onClick={handleLogout}>
            Log Out
          </div>
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Root>
  );
}

export default UserProfileMenu;
