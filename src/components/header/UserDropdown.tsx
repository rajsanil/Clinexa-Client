import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  ExpandMore,
  Person,
  Settings,
  HelpOutline,
  Logout,
} from "@mui/icons-material";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = () => {
    logout();
    navigate("/signin");
    closeDropdown();
  };

  const getDisplayName = (userName: string) => {
    if (userName.includes("@")) {
      return userName.split("@")[0];
    }
    return userName;
  };

  const getUserInitials = (userName: string) => {
    const displayName = getDisplayName(userName);
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {/* You can replace this with an actual image if available */}
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {user?.userName ? getUserInitials(user.userName) : "U"}
          </span>
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.userName ? getDisplayName(user.userName) : "User"}
        </span>
        <ExpandMore
          className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="pb-3 border-b border-gray-200 dark:border-gray-800">
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.userName || "Unknown User"}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.role || "User"}
          </span>
          {user?.isLockedOut && (
            <span className="mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
              Account Locked
            </span>
          )}
          {user?.requiresTwoFactor && (
            <span className="mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              2FA Required
            </span>
          )}
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Person className="w-6 h-6 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Settings className="w-6 h-6 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Account settings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <HelpOutline className="w-6 h-6 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Support
            </DropdownItem>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full text-left"
        >
          <Logout className="w-6 h-6 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
