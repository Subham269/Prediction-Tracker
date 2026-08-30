import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { NavLink, useLocation, matchPath } from "react-router-dom";
import { Home, Zap, Trophy, BarChart3, History, ClipboardList } from "lucide-react";

function AppSidebar() {
  const location = useLocation();

  const mainItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Cricket", path: "/Cricket", icon: Zap },
    { name: "Football", path: "/Football", icon: Trophy },
    { name: "Stats", path: "/Stats", icon: BarChart3 },
    { name: "My Predictions", path: "/MyPredictions", icon: ClipboardList },
    { name: "History", path: "/History", icon: History },
  ];

  const renderItem = (item) => {
    const isActive = !!matchPath(item.path, location.pathname);
    const Icon = item.icon;

    return (
      <SidebarMenuItem key={item.name}>
        <SidebarMenuButton
          asChild
          className="h-auto p-0 hover:!bg-transparent active:!bg-transparent"
        >
          <NavLink
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors duration-150 ${
              isActive
                ? "bg-[#F3FBF6] text-[#06A248] font-semibold pointer-events-none"
                : "text-gray-500 hover:!bg-[#F3FBF6] hover:!text-[#06A248]"
            }`}
          >
            <Icon size={18} strokeWidth={2} />
            {item.name}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="floating" className="bg-white border-r border-gray-100">
      <SidebarContent className="bg-white">
        <SidebarMenu className="mt-6 gap-1 px-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">
            Main
          </h2>
          {mainItems.map(renderItem)}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;