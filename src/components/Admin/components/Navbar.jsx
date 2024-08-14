import React from "react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const cric11 = () => {
    navigate("/");
  };
  return (
    <div className="fixed top-0 left-0 w-full bg-gray-900 p-3 flex flex-col z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1
            className="text-3xl font-bold cursor-pointer"
            onClick={() => cric11()}
          >
            Cric11
          </h1>
        </div>
        <div className="flex-1 mx-20">
          <input
            type="text"
            placeholder="Search..."
            className="w-35 p-1 px-2 rounded bg-gray-700 text-white placeholder-gray-400 outline-none"
          />
        </div>
        <div>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH4dcYWVFHFsz8M3Rsjpy2Hg6gQAmgbCIwWA&s"
            alt="Admin Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>
      <hr className="border-gray-400 mt-3" />
    </div>
  );
};
export default Navbar;
