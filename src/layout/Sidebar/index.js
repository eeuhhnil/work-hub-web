import SidebarLeftHome from "~/layout/Sidebar/Home/SidebarLeftHome";
import SidebarRightHome from "~/layout/Sidebar/Home/SidebarRightHome_Simple";
import SidebarLeftProject from "~/layout/Sidebar/Project/SidebarLeftProject";

function Sidebar({ layoutType, position }) {
  switch (layoutType) {
    case "home":
      if (position === "left") {
        return <SidebarLeftHome />;
      } else if (position === "right") {
        return <SidebarRightHome />;
      }
      break;
    case "project":
      if (position === "left") {
        return <SidebarLeftProject />;
      }
      break;
    default:
      return null;
  }
}

export default Sidebar;
