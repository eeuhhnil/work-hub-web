import Sidebar from "~/layout/Sidebar";
import Header from "../components/Header/Header";

function HomeLayout({ children, layoutType }) {
  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="flex min-h-screen">
        <Sidebar layoutType={layoutType} position={"left"} className="flex-none w-1/4" />
        <div className="content flex-grow p-4">{children}</div>
        <Sidebar layoutType={layoutType} position="right" className="flex-none w-1/4" />
      </div>
    </div>
  );
}

export default HomeLayout;
