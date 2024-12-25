import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";

function SpaceCard({ space }) {
  const menuItems = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-plus"
        >
          <path d="M5 12h14"></path>
          <path d="M12 5v14"></path>
        </svg>
      ),
      title: "Invite",
      to: "/login",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-settings"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      title: "Preferences",
      to: "/login",
    },
  ];

  return (
    <div className="flex flex-col p-4">
      <div className="flex justify-between">
        <h4 className="font-bold mb-0.5">{space.name}</h4>

        <RadixDropdownMenu.Root>
          <RadixDropdownMenu.Trigger asChild>
            <button className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-ellipsis"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </RadixDropdownMenu.Trigger>

          <RadixDropdownMenu.Content className="z-50 min-w-[8rem] rounded-md shadow-md background-primary border border-color p-4">
            {menuItems.map((menu, index) => (
              <RadixDropdownMenu.Item key={index} className="cursor-pointer text-sm text-popover-foreground hover:bg-accent rounded-sm px-2 py-1.5">
                <div className="flex">
                  <Link to={menu.to} className="text-white flex items-center">
                    {menu.icon && <span className="mr-2 text-white">{menu.icon}</span>}
                    <span>{menu.title}</span>
                  </Link>
                </div>
              </RadixDropdownMenu.Item>
            ))}
          </RadixDropdownMenu.Content>
        </RadixDropdownMenu.Root>
      </div>

      <div className="flex justify-between mt-4 items-center">
        <div className="text-muted-foreground text-[14px]"> members</div>
        <div className="text-xs border border-color rounded-md px-2.5 py-0.5">Team</div>
      </div>
    </div>
  );
}

export default SpaceCard;
