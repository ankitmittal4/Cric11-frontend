import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import UserTeams from "./components/UserTeams";
import Players from "./components/Players";
import Contests from "./components/Contests";
import Matches from "./components/Matches";
import Teams from "./components/Teams";
import ContestDetails from "./components/ContestDetails";
import Admin from "./components/Admin/Admin";
import UserContestDetails from "./components/UserContestDetails";

const AppContent = () => {
  const location = useLocation();
  const hideNavBar = location.pathname.startsWith("/admin");

  return (
    <div>
      {!hideNavBar && <NavBar />}
      <div className={` ${!hideNavBar ? "pt-20 container mx-auto p-4" : ""}`}>
        <Routes>
          <Route
            path="/"
            element={<h1 className="text-2xl font-bold">Welcome to Cric11</h1>}
          />
          <Route path="/user-teams" element={<Home />} />
          <Route path="/user-teams" element={<UserTeams />} />
          <Route path="/user-teams/:id" element={<UserContestDetails />} />
          <Route path="/players" element={<Players />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/contests/:id" element={<ContestDetails />} />
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
