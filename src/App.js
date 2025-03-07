import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "~/routes";
import React from "react";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Layout = route.layout || React.Fragment;
                        const Page = route.component;
                        const layoutType = route.layoutType || "";
                        const extraProps = route.extraProps || {};
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout layoutType={layoutType}>
                                        <Page {...extraProps} /> {}
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
