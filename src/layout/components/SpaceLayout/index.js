import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

function SpaceLayout() {
  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="flex min-h-screen">
        <div className="content w-full p-6"></div>
      </div>
    </div>
  );
}

export default SpaceLayout;
