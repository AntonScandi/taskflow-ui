import React from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const Login: React.FC = () => {
  const { authState } = useAuth();
  
  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-content2/50 p-4">
      <LoginForm />
    </div>
  );
};