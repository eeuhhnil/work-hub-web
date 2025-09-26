import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, protectedRoutes } from "~/routes";
import React from "react";
import ProtectedRoute from "~/components/auth/ProtectedRoute";
import { NotificationProvider } from "~/contexts/NotificationContext";

function App() {
    return (
        <NotificationProvider>
            <Router>
                <div>
                <Routes>
                    {/* Public Routes */}
                    {publicRoutes.map((route, index) => {
                        const Layout = route.layout || React.Fragment;
                        const Page = route.component;
                        const layoutType = route.layoutType || "";
                        const extraProps = route.extraProps || {};
                        return (
                            <Route
                                key={`public-${index}`}
                                path={route.path}
                                element={
                                    <Layout layoutType={layoutType}>
                                        <Page {...extraProps} />
                                    </Layout>
                                }
                            />
                        );
                    })}

                    {/* Protected Routes */}
                    {protectedRoutes.map((route, index) => {
                        const Layout = route.layout || React.Fragment;
                        const Page = route.component;
                        const layoutType = route.layoutType || "";
                        const extraProps = route.extraProps || {};
                        return (
                            <Route
                                key={`protected-${index}`}
                                path={route.path}
                                element={
                                    <ProtectedRoute>
                                        <Layout layoutType={layoutType}>
                                            <Page {...extraProps} />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                        );
                    })}
                </Routes>
                </div>
            </Router>
        </NotificationProvider>
    );
}

export default App;
