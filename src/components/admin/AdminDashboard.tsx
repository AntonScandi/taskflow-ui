import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { UserManagement } from "./UserManagement";
import { ProjectManagement } from "./ProjectManagement";
import { SystemSettings } from "./SystemSettings";

export const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState("users");
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      
      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={setSelectedTab}
        aria-label="Admin Dashboard Tabs"
        variant="underlined"
        classNames={{
          tabList: "gap-6",
        }}
      >
        <Tab key="users" title="User Management">
          <div className="mt-6">
            <UserManagement />
          </div>
        </Tab>
        <Tab key="projects" title="Project Management">
          <div className="mt-6">
            <ProjectManagement />
          </div>
        </Tab>
        <Tab key="settings" title="System Settings">
          <div className="mt-6">
            <SystemSettings />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};