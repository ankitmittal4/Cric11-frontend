import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Users from "./Users";
import Matches from "./Matches";
import Products from "./Products";
import Sellers from "./Sellers";
import CreateContest from "./CreateContest";
const DashboardRoutes = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <div className="flex-1 ml-[20%] p-10 overflow-auto">
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/matches" element={<Matches />} />
            <Route
              path="/matches/create-contest/:matchId"
              element={<CreateContest />}
            />
            <Route path="/products" element={<Products />} />
            <Route path="/sellers" element={<Sellers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardRoutes;
