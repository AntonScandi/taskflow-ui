import React from "react";
import { Sidebar } from "../components/sidebar";
import { TopToolbar } from "../components/top-toolbar";
import { NotificationsPanel } from "../components/notifications-panel";
import { UserDashboard } from "../components/dashboard/UserDashboard";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { KanbanBoard } from "../components/kanban-board";
import { TimelineView } from "../components/timeline-view";
import { CalendarView } from "../components/calendar-view";
import { ReportsView } from "../components/reports/ReportsView";
import { useAuth } from "../contexts/AuthContext";
import { useSampleData } from "../hooks/use-sample-data";

export const Dashboard: React.FC = () => {
  const [selectedView, setSelectedView] = React.useState("dashboard");
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = React.useState(false);
  const { tasks, projects, users, notifications } = useSampleData();
  
  const { authState } = useAuth();
  const isAdmin = authState.user?.roleType === "admin";
  
  const toggleNotificationsPanel = () => {
    setIsNotificationsPanelOpen(!isNotificationsPanelOpen);
  };

  const renderContent = () => {
    switch (selectedView) {
      case "dashboard":
        return isAdmin ? <AdminDashboard /> : <UserDashboard />;
      case "kanban":
        return <KanbanBoard tasks={tasks} users={users} />;
      case "timeline":
        return <TimelineView tasks={tasks} users={users} projects={projects} />;
      case "calendar":
        return <CalendarView tasks={tasks} />;
      case "reports":
        return <ReportsView />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        selectedView={selectedView}
        onViewChange={setSelectedView}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopToolbar 
          onNotificationsClick={toggleNotificationsPanel}
          notificationCount={notifications.length}
        />
        
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
      
      <NotificationsPanel 
        isOpen={isNotificationsPanelOpen}
        onClose={() => setIsNotificationsPanelOpen(false)}
        notifications={notifications}
        users={users}
      />
    </div>
  );
};