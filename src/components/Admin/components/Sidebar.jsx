import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <div className="fixed top-16 left-0 w-1/5 bg-gray-800 p-5 h-[calc(100vh-4rem)] ">
    <ul className="text-2xl">
      <li className="mb-3">
        <Link to="" className="block p-1 px-3 rounded-lg hover:bg-gray-600">
          Users
        </Link>
      </li>
      <li className="mb-3">
        <Link
          to="matches"
          className="block p-1 px-3 rounded-lg hover:bg-gray-600"
        >
          Matches
        </Link>
      </li>
      <li className="mb-3">
        <Link
          to="contests"
          className="block p-1 px-3 rounded-lg hover:bg-gray-600"
        >
          Contests
        </Link>
      </li>
      <li className="mb-3">
        <Link
          to="sellers"
          className="block p-1 px-3 rounded-lg hover:bg-gray-600"
        >
          Sellers
        </Link>
      </li>
    </ul>
  </div>
);

export default Sidebar;
