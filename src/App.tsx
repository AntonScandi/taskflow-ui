import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { Sidebar } from "./components/sidebar";
import { TopToolbar } from "./components/top-toolbar";
import { KanbanBoard } from "./components/kanban-board";
import { TimelineView } from "./components/timeline-view";
import { CalendarView } from "./components/calendar-view";
import { NotificationsPanel } from "./components/notifications-panel";
import { useSampleData } from "./hooks/use-sample-data";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Icon icon="lucide:loader" className="text-primary text-2xl animate-spin mb-2" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  const [selectedView, setSelectedView] = React.useState("kanban");
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = React.useState(false);
  const { tasks, projects, users, notifications } = useSampleData();
  
  const toggleNotificationsPanel = () => {
    setIsNotificationsPanelOpen(!isNotificationsPanelOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}