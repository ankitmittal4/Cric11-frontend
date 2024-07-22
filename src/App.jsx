import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import UserTeams from "./components/UserTeams";
import Players from "./components/Players";
import Contests from "./components/Contests";
import Matches from "./components/Matches";
import Teams from "./components/Teams";

const App = () => {
  return (
    <Router>
      <NavBar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/user-teams" element={<UserTeams />} />
          <Route path="/players" element={<Players />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/teams" element={<Teams />} />
          <Route
            path="/"
            element={<h1 className="text-2xl font-bold">Welcome to Cric11</h1>}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
