import LandingPage from "~/pages/landing";
import Login from "~/pages/login";
import Register from "~/pages/register";
import BoardingPage from "~/pages/boarding";
import CreateSpace from "~/pages/createSpace";
import LandingLayout from "~/layout/components/Landing/LandingLayout";
import Project from "~/pages/project";
import ProjectLayout from "~/layout/components/ProjectLayout";
import HeaderOnly from "~/layout/HeaderOnly";
import UserProfile from "~/pages/UserProfile";
import HomeLayout from "~/layout/HomeLayout";
import DropdownItem from "~/pages/fggf";
import Home from "~/pages/home";
import Members from "~/pages/members";


export const publicRoutes = [
  { path: "/", component: LandingPage, layout: LandingLayout },
  { path: "/login", component: Login, layout: null },
  { path: "/register", component: Register, layout: null },
  { path: "/boarding", component: BoardingPage, layout: null },
  { path: "/boarding/new", component: CreateSpace, layout: null },
  { path: "/space/:spaceId",component: Home, layout: HomeLayout, layoutType: "home"},
  { path: "/space/:spaceId/member",component: Members, layout: HeaderOnly},
  { path: "/project", component: Project, layout: HeaderOnly },
  { path: "/project/:projectId", component: ProjectLayout, layout: null },
  { path: "/aa", component: DropdownItem, layout: null },
  { path: "/profile", component: UserProfile, layout: HeaderOnly },

];
