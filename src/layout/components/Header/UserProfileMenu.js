import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { apiRequest } from "~/config/api";
import API_CONFIG from "~/config/api";

function UserProfileMenu() {
  const { spaceId } = useParams();
  const navigate = useNavigate();

  const cachedAvatar = localStorage.getItem("user_avatar") || "";

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      // Xóa tokens và redirect
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('selectedSpace');
      localStorage.removeItem('user_avatar');
      navigate('/login');
    }
  };

  return (
      <RadixDropdownMenu.Root>
        <RadixDropdownMenu.Trigger>
          <button className="h-[32px] w-[32px]">
            <img
                className="rounded-full object-cover w-full h-full"
                src={cachedAvatar || "/default-avatar.png"}
                alt="User avatar"
                onError={(e) => e.currentTarget.src = "/default-avatar.png"}
            />
          </button>
        </RadixDropdownMenu.Trigger>
        <RadixDropdownMenu.Content className="background-primary border border-color rounded-md w-56 transform -translate-x-4">
          <div className="px-2 py-1.5">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">User</p>
              <p className="text-xs text-gray-400">Logged in</p>
            </div>
          </div>

          <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>
          <Link to={`/space/${spaceId}/profile`} className="flex items-center px-2 py-1.5">Profile</Link>
          <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>
          <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>

          <div className="flex items-center px-2 py-1.5 cursor-pointer text-red-500" onClick={handleLogout}>
            Log Out
          </div>
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Root>
  );
}

export default UserProfileMenu;

