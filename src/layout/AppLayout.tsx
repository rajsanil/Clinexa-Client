import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { ActionBarProvider } from "../context/ActionBarContext";
import { Outlet } from "react-router";
import ActionBar from "./ActionBar";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen lg:flex overflow-hidden">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <ActionBar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 mx-auto w-full h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <ActionBarProvider>
        <LayoutContent />
      </ActionBarProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
