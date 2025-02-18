import LandingPage from "~/pages/landing";
import Login from "~/pages/login";
import Register from "~/pages/register";
import BoardingPage from "~/pages/boarding";
import CreateSpace from "~/pages/createSpace";
import LandingLayout from "~/layout/components/Landing/LandingLayout";
import Home from "~/pages/home";
import Calendar from "~/pages/calender";
import Project from "~/pages/project";
import ProjectLayout from "~/layout/components/ProjectLayout";
import ProjectDetail from "~/pages/projectDetail";
import Members from "~/pages/members";
import Setting from "~/pages/settings";
import HeaderOnly from "~/layout/HeaderOnly";
import UserProfile from "~/pages/UserProfile";
import HomeLayout from "~/layout/HomeLayout";
import DropdownItem from "~/pages/fggf";

export const publicRoutes = [
  { path: "/", component: LandingPage, layout: LandingLayout },
  { path: "/login", component: Login, layout: null },
  { path: "/register", component: Register, layout: null },
  { path: "/boarding", component: BoardingPage, layout: null },
  { path: "/boarding/new", component: CreateSpace, layout: null },
  { path: "/home", component: Home, layout: HomeLayout, layoutType: "home" },
  { path: "/project", component: Project, layout: HeaderOnly },
  { path: "/project/:projectId", component: ProjectLayout, layout: null },
  { path: "/aa", component: DropdownItem, layout: null },

  { path: "/profile", component: UserProfile, layout: HeaderOnly },
  // { path: "/projectDetail", component: ProjectLayout, layout: null },
  // { path: "/calendar", component: Calendar, layout: null },
  // { path: "/members", component: Members, layout: ProjectLayout },
  // { path: "/setting", component: Setting, layout: ProjectLayout },
];
