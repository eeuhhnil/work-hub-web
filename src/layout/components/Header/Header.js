import SpaceDropdown from "./SpaceDropdown";
import NavLinks from "./NavLinks";
import UserProfileMenu from "./UserProfileMenu";
import { NotificationBell } from "../../../components/Notification";

function Header() {
  return (
    <div className="sticky top-0 left-0 right-0 background-primary border border-color">
      <div className="h-[64px] flex items-center justify-between px-4">
        <div className="flex items-center">
          <SpaceDropdown />
          <NavLinks />
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <UserProfileMenu />
        </div>
      </div>
    </div>
  );
}

export default Header;
