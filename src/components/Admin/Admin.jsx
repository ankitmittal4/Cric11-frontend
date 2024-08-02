import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import DashboardRoutes from "./components/DashboardRoutes";

function Admin() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="dashboard/*" element={<DashboardRoutes />} />
    </Routes>
  );
}

export default Admin;
