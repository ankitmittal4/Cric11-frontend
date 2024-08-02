import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-red-600 p-4 fixed top-0 left-0 w-full border-b-2 border-gray-400">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Cric11</div>
        <div className="font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white px-3 ${
                isActive ? "text-white" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/user-teams"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white px-3 ${
                isActive ? "text-white" : ""
              }`
            }
          >
            User Teams
          </NavLink>
          <NavLink
            to="/players"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white px-3 ${
                isActive ? "text-white" : ""
              }`
            }
          >
            Players
          </NavLink>
          <NavLink
            to="/contests"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white px-3 ${
                isActive ? "text-white" : ""
              }`
            }
          >
            Contests
          </NavLink>
          <NavLink
            to="/matches"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white px-3 ${
                isActive ? "text-white" : ""
              }`
            }
          >
            Matches
          </NavLink>
          <NavLink
            to="/teams"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white px-3 ${
                isActive ? "text-white" : ""
              }`
            }
          >
            Teams
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
