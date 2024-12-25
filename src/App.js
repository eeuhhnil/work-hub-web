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
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout layoutType={layoutType}>
                    <Page />
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
