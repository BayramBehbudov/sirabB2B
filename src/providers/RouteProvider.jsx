import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import routes from "../routes/routes";
import AuthWrapper from "@/pages/Auth/AuthWrapper";
import Login from "@/pages/Auth/Login";
import NotAllowed from "@/pages/404/NotAllowed";

const RouteProvider = ({ children }) => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Login />} />
        <Route
          element={
            <AuthWrapper>
              <MainLayout />
            </AuthWrapper>
          }
        >
          {routes.map((r) => (
            <Fragment key={r.path}>
              <Route path={r.path} element={<r.component />} />
              {r.children &&
                r.children.map((c) => (
                  <Route key={c.path} path={c.path} element={<c.component />} />
                ))}
            </Fragment>
          ))}
          <Route path="/not-allowed" element={<NotAllowed />} />
        </Route>
      </Routes>
      {children}
    </Router>
  );
};

export default RouteProvider;
