import React from "react";
import { Card, CardBody, CardHeader, Input, Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const RegisterForm: React.FC = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Form validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!password) {
      setError("Password is required");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
        <p className="text-default-500 text-sm">Create a new account</p>
      </CardHeader>
      
      <CardBody className="px-6 py-5">
        {error && (
          <div className="bg-danger/10 text-danger p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onValueChange={setName}
            placeholder="Enter your full name"
            isRequired
            startContent={<Icon icon="lucide:user" className="text-default-400" />}
          />
          
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
            placeholder="Create a password"
            isRequired
            startContent={<Icon icon="lucide:lock" className="text-default-400" />}
          />
          
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            placeholder="Confirm your password"
            isRequired
            startContent={<Icon icon="lucide:lock" className="text-default-400" />}
          />
          
          <Button 
            type="submit" 
            color="primary" 
            className="w-full" 
            isLoading={isLoading}
          >
            Create Account
          </Button>
          
          <div className="text-center text-sm text-default-500">
            Already have an account?{" "}
            <Link href="/login" className="text-primary">
              Sign in
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};