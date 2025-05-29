import React from "react";
import { Icon } from "@iconify/react";
import { Button, Tooltip } from "@heroui/react";

interface SidebarProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedView, onViewChange }) => {
  const menuItems = [
    { id: "kanban", label: "Tasks", icon: "lucide:layout-dashboard" },
    { id: "timeline", label: "Timeline", icon: "lucide:gantt-chart" },
    { id: "calendar", label: "Calendar", icon: "lucide:calendar" },
    { id: "reports", label: "Reports", icon: "lucide:bar-chart" },
    { id: "settings", label: "Settings", icon: "lucide:settings" },
  ];

  return (
    <aside className="w-64 bg-content1 border-r border-divider flex flex-col">
      <div className="p-4 border-b border-divider">
        <div className="flex items-center">
          <div className="bg-primary/10 rounded-md p-2 mr-3">
            <Icon icon="lucide:check-square" className="text-primary text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">TaskFlow</h1>
            <p className="text-xs text-default-500">Project Management</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 py-4">
        <div className="px-3 mb-2">
          <Button 
            color="primary" 
            className="w-full justify-start"
            startContent={<Icon icon="lucide:plus" />}
          >
            New Task
          </Button>
        </div>
        
        <div className="mt-6">
          <p className="px-4 text-xs font-medium text-default-500 mb-2 uppercase">Workspace</p>
          <nav>
            {menuItems.map((item) => (
              <Tooltip key={item.id} content={item.label} placement="right">
                <Button
                  variant={selectedView === item.id ? "flat" : "light"}
                  color={selectedView === item.id ? "primary" : "default"}
                  className="w-full justify-start rounded-none mb-1"
                  startContent={<Icon icon={item.icon} className="text-lg" />}
                  onPress={() => onViewChange(item.id)}
                >
                  {item.label}
                </Button>
              </Tooltip>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t border-divider">
        <div className="flex items-center">
          <img 
            src="https://img.heroui.chat/image/avatar?w=40&h=40&u=1" 
            alt="User avatar" 
            className="w-8 h-8 rounded-full mr-3" 
          />
          <div>
            <p className="text-sm font-medium">Alex Morgan</p>
            <p className="text-xs text-default-500">Product Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};