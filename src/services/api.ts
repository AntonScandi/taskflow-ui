import axios from "axios";

// Base API URL - replace with your actual backend URL in production
const BASE_URL = "http://localhost:5000"; // Updated to point to our Express server

// Create axios instance with default config
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// For demo purposes, we'll simulate API responses
const DEMO_MODE = false; // Changed to false to use the actual server

// Mock data store for demo mode
const mockDb = {
  users: [
    {
      id: "user1",
      name: "Alex Morgan",
      email: "alex@example.com",
      password: "password123", // In a real app, this would be hashed
      avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
      role: "Product Manager",
      roleType: "admin"
    },
    {
      id: "user2",
      name: "Taylor Swift",
      email: "taylor@example.com",
      password: "password123",
      avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=2",
      role: "UI Designer",
      roleType: "user"
    }
  ],
  projects: [
    {
      id: "project1",
      name: "Website Redesign",
      color: "#3b82f6"
    },
    {
      id: "project2",
      name: "Mobile App",
      color: "#8b5cf6"
    },
    {
      id: "project3",
      name: "Marketing Campaign",
      color: "#10b981"
    }
  ],
  tasks: [
    {
      id: "task1",
      title: "Create wireframes",
      description: "Design initial wireframes for the homepage and product pages",
      status: "done",
      priority: "high",
      assignees: ["user2"],
      startDate: "2023-06-01",
      endDate: "2023-06-05",
      dueDate: "2023-06-05",
      progress: 100,
      projectId: "project1"
    },
    {
      id: "task2",
      title: "User research",
      description: "Conduct interviews with 5 potential users",
      status: "done",
      priority: "medium",
      assignees: ["user1", "user2"],
      startDate: "2023-06-03",
      endDate: "2023-06-08",
      dueDate: "2023-06-08",
      progress: 100,
      projectId: "project1"
    }
    // More tasks would be here
  ],
  comments: [
    {
      id: "comment1",
      userId: "user1",
      taskId: "task1",
      content: "Let's make sure we include mobile wireframes too",
      timestamp: "2023-06-02T14:30:00",
      mentions: ["user2"]
    },
    {
      id: "comment2",
      userId: "user2",
      taskId: "task1",
      content: "I've added those @Alex Morgan",
      timestamp: "2023-06-02T15:45:00",
      mentions: ["user1"]
    }
  ],
  milestones: [
    {
      id: "milestone1",
      title: "Design Phase Complete",
      description: "All design assets and wireframes approved",
      date: "2023-06-10",
      projectId: "project1",
      completed: true
    },
    {
      id: "milestone2",
      title: "Beta Launch",
      description: "Release beta version to test group",
      date: "2023-06-25",
      projectId: "project1",
      completed: false
    }
  ]
};

// Mock API handlers
const mockApi = {
  // Auth endpoints
  "POST /auth/login": (data: any) => {
    const { email, password } = data;
    const user = mockDb.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return [401, { message: "Invalid credentials" }];
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return [200, { 
      user: userWithoutPassword, 
      token: `mock-jwt-token-${user.id}-${Date.now()}` 
    }];
  },
  
  "POST /auth/register": (data: any) => {
    const { name, email, password } = data;
    
    if (mockDb.users.some(u => u.email === email)) {
      return [400, { message: "Email already in use" }];
    }
    
    const newUser = {
      id: `user${mockDb.users.length + 1}`,
      name,
      email,
      password,
      avatar: `https://img.heroui.chat/image/avatar?w=200&h=200&u=${mockDb.users.length + 5}`,
      role: "Team Member",
      roleType: "user"
    };
    
    mockDb.users.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return [200, { 
      user: userWithoutPassword, 
      token: `mock-jwt-token-${newUser.id}-${Date.now()}` 
    }];
  },
  
  // User endpoints
  "GET /users": () => {
    const usersWithoutPasswords = mockDb.users.map(({ password, ...user }) => user);
    return [200, usersWithoutPasswords];
  },
  
  "GET /users/:id": (id: string) => {
    const user = mockDb.users.find(u => u.id === id);
    
    if (!user) {
      return [404, { message: "User not found" }];
    }
    
    const { password, ...userWithoutPassword } = user;
    return [200, userWithoutPassword];
  },
  
  "PUT /users/:id": (id: string, data: any) => {
    const index = mockDb.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return [404, { message: "User not found" }];
    }
    
    // Update user data
    mockDb.users[index] = { ...mockDb.users[index], ...data };
    
    const { password, ...userWithoutPassword } = mockDb.users[index];
    return [200, userWithoutPassword];
  },
  
  // Project endpoints
  "GET /projects": () => {
    return [200, mockDb.projects];
  },
  
  "POST /projects": (data: any) => {
    const newProject = {
      id: `project${mockDb.projects.length + 1}`,
      ...data
    };
    
    mockDb.projects.push(newProject);
    return [201, newProject];
  },
  
  // Task endpoints
  "GET /tasks": (query: any) => {
    let filteredTasks = [...mockDb.tasks];
    
    // Filter by assignee if specified
    if (query.assignee) {
      filteredTasks = filteredTasks.filter(task => 
        task.assignees.includes(query.assignee)
      );
    }
    
    // Filter by project if specified
    if (query.projectId) {
      filteredTasks = filteredTasks.filter(task => 
        task.projectId === query.projectId
      );
    }
    
    return [200, filteredTasks];
  },
  
  "POST /tasks": (data: any) => {
    const newTask = {
      id: `task${mockDb.tasks.length + 1}`,
      ...data
    };
    
    mockDb.tasks.push(newTask);
    return [201, newTask];
  },
  
  "PUT /tasks/:id": (id: string, data: any) => {
    const index = mockDb.tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      return [404, { message: "Task not found" }];
    }
    
    mockDb.tasks[index] = { ...mockDb.tasks[index], ...data };
    return [200, mockDb.tasks[index]];
  },
  
  // Comment endpoints
  "GET /tasks/:taskId/comments": (taskId: string) => {
    const comments = mockDb.comments.filter(c => c.taskId === taskId);
    return [200, comments];
  },
  
  "POST /tasks/:taskId/comments": (taskId: string, data: any) => {
    const newComment = {
      id: `comment${mockDb.comments.length + 1}`,
      taskId,
      timestamp: new Date().toISOString(),
      ...data
    };
    
    mockDb.comments.push(newComment);
    return [201, newComment];
  },
  
  // Milestone endpoints
  "GET /projects/:projectId/milestones": (projectId: string) => {
    const milestones = mockDb.milestones.filter(m => m.projectId === projectId);
    return [200, milestones];
  },
  
  "POST /projects/:projectId/milestones": (projectId: string, data: any) => {
    const newMilestone = {
      id: `milestone${mockDb.milestones.length + 1}`,
      projectId,
      completed: false,
      ...data
    };
    
    mockDb.milestones.push(newMilestone);
    return [201, newMilestone];
  }
};

// Process mock API request
const processMockRequest = async (method: string, url: string, data?: any) => {
  console.log(`[Mock API] ${method} ${url}`, data);
  
  // Extract base endpoint and ID if present
  const urlParts = url.split('?')[0].split('/');
  const queryString = url.includes('?') ? url.split('?')[1] : '';
  const query = Object.fromEntries(new URLSearchParams(queryString));
  
  // Handle different endpoint patterns
  let mockEndpoint;
  let id;
  
  if (urlParts.length >= 4 && !isNaN(Number(urlParts[3]))) {
    // Endpoints like /tasks/:taskId/comments
    mockEndpoint = `${method} /${urlParts[1]}/:id/${urlParts[3]}`;
    id = urlParts[2];
  } else if (urlParts.length >= 3 && !isNaN(Number(urlParts[2]))) {
    // Endpoints like /users/:id
    mockEndpoint = `${method} /${urlParts[1]}/:id`;
    id = urlParts[2];
  } else {
    // Standard endpoints like /users or /tasks
    mockEndpoint = `${method} /${urlParts[1]}`;
  }
  
  // Find and execute the mock handler
  const handler = (mockApi as any)[mockEndpoint];
  
  if (!handler) {
    console.error(`[Mock API] No handler for ${mockEndpoint}`);
    return Promise.reject({ response: { status: 404, data: { message: "Endpoint not found" } } });
  }
  
  // Execute the handler with appropriate arguments
  const [status, responseData] = id 
    ? handler(id, data, query)
    : handler(data || query);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (status >= 400) {
    return Promise.reject({ response: { status, data: responseData } });
  }
  
  return { data: responseData };
};

// API wrapper with mock support
export const api = {
  setAuthToken: (token: string) => {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
  
  removeAuthToken: () => {
    delete instance.defaults.headers.common["Authorization"];
  },
  
  get: async (url: string) => {
    if (DEMO_MODE) {
      return processMockRequest("GET", url);
    }
    return instance.get(url);
  },
  
  post: async (url: string, data?: any) => {
    if (DEMO_MODE) {
      return processMockRequest("POST", url, data);
    }
    return instance.post(url, data);
  },
  
  put: async (url: string, data?: any) => {
    if (DEMO_MODE) {
      return processMockRequest("PUT", url, data);
    }
    return instance.put(url, data);
  },
  
  delete: async (url: string) => {
    if (DEMO_MODE) {
      return processMockRequest("DELETE", url);
    }
    return instance.delete(url);
  },
  
  // Explicit methods for auth endpoints
  register: async (name: string, email: string, password: string) => {
    return instance.post("/auth/register", { name, email, password });
  },
  
  login: async (email: string, password: string) => {
    return instance.post("/auth/login", { email, password });
  }
};