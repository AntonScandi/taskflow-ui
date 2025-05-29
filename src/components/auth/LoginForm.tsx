import React from "react";
import { Card, CardBody, CardHeader, Input, Button, Checkbox, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Form validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!password) {
      setError("Password is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader className="flex flex-col gap-1 items-center">
        <div className="bg-primary/10 rounded-md p-3 mb-2">
          <Icon icon="lucide:check-square" className="text-primary text-2xl" />
        </div>
        <h1 className="text-xl font-semibold">TaskFlow</h1>
        <p className="text-default-500 text-sm">Sign in to your account</p>
      </CardHeader>
      
      <CardBody className="px-6 py-5">
        {error && (
          <div className="bg-danger/10 text-danger p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onValueChange={setEmail}
            placeholder="Enter your email"
            isRequired
            startContent={<Icon icon="lucide:mail" className="text-default-400" />}
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onValueChange={setPassword}
            placeholder="Enter your password"
            isRequired
            startContent={<Icon icon="lucide:lock" className="text-default-400" />}
          />
          
          <div className="flex justify-between items-center">
            <Checkbox isSelected={rememberMe} onValueChange={setRememberMe}>
              <span className="text-sm">Remember me</span>
            </Checkbox>
            
            <Link href="/forgot-password" className="text-sm">
              Forgot password?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            color="primary" 
            className="w-full" 
            isLoading={isLoading}
          >
            Sign In
          </Button>
          
          <div className="text-center text-sm text-default-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary">
              Sign up
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};