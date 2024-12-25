import LandingPage from "~/pages/landing";
import Login from "~/pages/login";
import Register from "~/pages/register";
import BoardingPage from "~/pages/boarding";
import CreateSpace from "~/pages/createSpace";
import LandingLayout from "~/layout/components/Landing/LandingLayout";
import Home from "~/pages/home";
import DefaultLayout from "~/layout/DefaultLayout";
import Calendar from "~/pages/calender";
import Project from "~/pages/project";
import HeaderOnly from "~/layout/HeaderOnly";

export const publicRoutes = [
  { path: "/", component: LandingPage, layout: LandingLayout },
  { path: "/login", component: Login, layout: null },
  { path: "/register", component: Register, layout: null },
  { path: "/boarding", component: BoardingPage, layout: null },
  { path: "/boarding/new", component: CreateSpace, layout: null },
  { path: "/home", component: Home, layout: DefaultLayout, layoutType: "home" },
  { path: "/project", component: Project, layout: HeaderOnly },
  { path: "/calendar", component: Calendar, layout: null },
];
