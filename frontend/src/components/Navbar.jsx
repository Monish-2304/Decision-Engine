import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Rule Engine</div>
        <div className="space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 px-3 py-2 rounded-md font-semibold"
                : "text-white hover:bg-gray-700 px-3 py-2 rounded-md"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/rules"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 px-3 py-2 rounded-md font-semibold"
                : "text-white hover:bg-gray-700 px-3 py-2 rounded-md"
            }
          >
            Rules
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 px-3 py-2 rounded-md font-semibold"
                : "text-white hover:bg-gray-700 px-3 py-2 rounded-md"
            }
          >
            Help
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
