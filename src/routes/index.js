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
import Home from "~/pages/home";
import Members from "~/pages/members";
import Setting from "~/pages/settings";
import TaskList from "~/pages/Tasks/Lists";
import TaskCalendar from "~/pages/Tasks/Calendar";
import ApiTest from "~/pages/test/ApiTest";
import NotificationTest from "~/pages/test/NotificationTest";
import SocketTest from "~/pages/test/SocketTest";
import NotificationLogicTest from "~/pages/test/NotificationLogicTest";
import Analytics from "~/pages/Analytics";

// Public routes - không cần authentication
export const publicRoutes = [
  { path: "/", component: LandingPage, layout: LandingLayout },
  { path: "/login", component: Login, layout: null },
  { path: "/register", component: Register, layout: null },
  { path: "/test/api", component: ApiTest, layout: null },
  { path: "/test/socket", component: SocketTest, layout: null },
];

export const protectedRoutes = [
  { path: "/boarding", component: BoardingPage, layout: null },
  { path: "/spaces", component: BoardingPage, layout: null },
  { path: "/boarding/new", component: CreateSpace, layout: null },
  { path: "/space/:spaceId", component: Home, layout: HomeLayout, layoutType: "home"},
  { path: "/space/:spaceId/member", component: Members, layout: HeaderOnly, extraProps: { type: "space" } },
  { path: "/space/:spaceId/profile", component: UserProfile, layout: HeaderOnly},
  { path: "/space/:spaceId/project", component: Project, layout: HeaderOnly},
  { path: "/space/:spaceId/project/:projectId", component: ProjectLayout, layout: null},
  { path: "/space/:spaceId/project/:projectId/member", component: Members, layout: ProjectLayout, extraProps: { type: "project" } },
  { path: "/space/:spaceId/project/:projectId/setting", component: Setting, layout: ProjectLayout},
  { path: "/space/:spaceId/project/:projectId/taskList", component: TaskList, layout: ProjectLayout},
  { path: "/space/:spaceId/project/:projectId/calendar", component: TaskCalendar, layout: ProjectLayout},
  { path: "/space/:spaceId/analytics", component: Analytics, layout: HeaderOnly},
  { path: "/space/:spaceId/project/:projectId/analytics", component: Analytics, layout: ProjectLayout},
  { path: "/test/notifications", component: NotificationTest, layout: HeaderOnly},
  { path: "/test/socket", component: SocketTest, layout: HeaderOnly},
  { path: "/test/notification-logic", component: NotificationLogicTest, layout: HeaderOnly},
];
