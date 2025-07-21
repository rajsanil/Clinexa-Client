import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { useActionBar } from "../context/ActionBarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import {
  Menu,
  Close,
  MoreHoriz,
  Search,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  FileDownload,
  FileUpload,
  Refresh,
  Visibility,
} from "@mui/icons-material";
import { ActionBarAction, ActionType } from "../types/actionbar.types";
import { CircularProgress } from "@mui/material";

const ActionBar: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { config } = useActionBar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (config?.onSearch) {
      config.onSearch(searchQuery);
    }
  };

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case "add":
        return <Add className="w-4 h-4" />;
      case "edit":
        return <Edit className="w-4 h-4" />;
      case "delete":
        return <Delete className="w-4 h-4" />;
      case "save":
        return <Save className="w-4 h-4" />;
      case "cancel":
        return <Cancel className="w-4 h-4" />;
      case "export":
        return <FileDownload className="w-4 h-4" />;
      case "import":
        return <FileUpload className="w-4 h-4" />;
      case "refresh":
        return <Refresh className="w-4 h-4" />;
      case "view":
        return <Visibility className="w-4 h-4" />;
      case "search":
        return <Search className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getActionVariantClasses = (variant?: string) => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
      case "success":
        return "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500";
      case "secondary":
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700";
    }
  };

  const renderActionButton = (action: ActionBarAction) => {
    if (action.hidden) return null;

    const iconElement = action.icon || getActionIcon(action.type);
    const variantClasses = getActionVariantClasses(action.variant);

    return (
      <button
        key={action.id}
        onClick={action.onClick}
        disabled={action.disabled || action.loading}
        title={action.tooltip || action.label}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses}`}
      >
        {action.loading ? (
          <CircularProgress size={16} className="text-current" />
        ) : (
          iconElement
        )}
        {/* <span className="hidden sm:inline">{action.label}</span> */}
      </button>
    );
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-9999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6 gap-4">
        {/* Top section with menu, logo, and mobile actions */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <div className="flex items-center gap-3">
            <button
              className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-9999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              {isMobileOpen ? (
                <Close className="w-6 h-6" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>

            <Link to="/" className="lg:hidden">
              <img
                className="dark:hidden"
                src="./images/logo/logo.svg"
                alt="Logo"
              />
              <img
                className="hidden dark:block"
                src="./images/logo/logo-dark.svg"
                alt="Logo"
              />
            </Link>

            {/* Page Title */}
            {/* {config?.title && (
              <div className="hidden lg:block">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {config.title}
                </h1>
                {config.subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {config.subtitle}
                  </p>
                )}
              </div>
            )} */}
          </div>

          {/* Left Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {config?.leftActions?.map(renderActionButton)}
          </div>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-9999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <MoreHoriz className="w-6 h-6" />
          </button>

          {/* Search */}
          {config?.showSearch && (
            <div className="hidden lg:block">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                    <Search className="w-5 h-5 fill-gray-500 dark:fill-gray-400" />
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      config.searchPlaceholder || "Search or type command..."
                    }
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                  />

                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
                  >
                    <span> ⌘ </span>
                    <span> K </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Actions and user section */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          {/* Main Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {config?.actions.map(renderActionButton)}
          </div>

          {/* Right side - Theme toggle, notifications, and user */}
          <div className="flex items-center gap-3">
            {/* Right Actions */}
            {config?.rightActions?.map(renderActionButton)}

            <div className="flex items-center gap-2 2xsm:gap-3">
              <ThemeToggleButton />
              <NotificationDropdown />
            </div>
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ActionBar;
