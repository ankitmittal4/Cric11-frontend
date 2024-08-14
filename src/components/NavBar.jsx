import React from "react";
import { NavLink } from "react-router-dom";
import WalletBalance from "./WalletBalance";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const navigate = useNavigate();
  const cric11 = () => {
    navigate("/");
  };
  return (
    <nav className="bg-red-600 p-4 fixed top-0 left-0 w-full border-b-2 border-gray-400">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="text-white text-xl font-bold cursor-pointer"
          onClick={() => cric11()}
        >
          Cric11
        </div>
        <div className="font-medium flex items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white px-3  ${
                isActive ? "text-white" : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/my-contests"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white px-3 ${
                isActive ? "text-white" : ""
              }`
            }
          >
            My Contests
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `text-gray-300 hover:text-white px-3 ${
                isActive ? "text-white" : ""
              }`
            }
          >
            Transactions
          </NavLink>
          <div className="text-black font-medium">
            <WalletBalance />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
