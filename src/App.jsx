import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import ContestDetails from "./components/ContestDetails";
import MyContests from "./components/MyContests";
import MyContestDetails from "./components/MyContestsDetails";
import Transactions from "./components/Transactions";

import Admin from "./components/Admin/Admin";

const AppContent = () => {
  const location = useLocation();
  const hideNavBar = location.pathname.startsWith("/admin");

  return (
    <div>
      {!hideNavBar && <NavBar />}
      <div className={` ${!hideNavBar ? "pt-20 container mx-auto p-4" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<ContestDetails />} />
          <Route path="/my-contests" element={<MyContests />} />
          <Route path="/my-contests/:id" element={<MyContestDetails />} />
          <Route path="/transactions" element={<Transactions />} />

          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
