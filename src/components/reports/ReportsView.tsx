import React from "react";
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Button,
  Tabs,
  Tab
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Task, User } from "../../types/data-types";
import { api } from "../../services/api";

export const ReportsView: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState("taskStatus");
  
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tasksResponse, usersResponse] = await Promise.all([
          api.get("/tasks"),
          api.get("/users")
        ]);
        
        setTasks(tasksResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getTaskStatusData = () => {
    const statusCounts = {
      todo: 0,
      inProgress: 0,
      done: 0
    };
    
    tasks.forEach(task => {
      if (task.status in statusCounts) {
        statusCounts[task.status as keyof typeof statusCounts]++;
      }
    });
    
    return [
      { name: "To Do", value: statusCounts.todo, color: "#a1a1aa" },
      { name: "In Progress", value: statusCounts.inProgress, color: "#3b82f6" },
      { name: "Done", value: statusCounts.done, color: "#22c55e" }
    ];
  };
  
  const getTaskPriorityData = () => {
    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0
    };
    
    tasks.forEach(task => {
      if (task.priority in priorityCounts) {
        priorityCounts[task.priority as keyof typeof priorityCounts]++;
      }
    });
    
    return [
      { name: "Low", value: priorityCounts.low, color: "#22c55e" },
      { name: "Medium", value: priorityCounts.medium, color: "#f59e0b" },
      { name: "High", value: priorityCounts.high, color: "#ef4444" }
    ];
  };
  
  const getUserWorkloadData = () => {
    const userTaskCounts: Record<string, { total: number; completed: number; name: string }> = {};
    
    users.forEach(user => {
      userTaskCounts[user.id] = {
        total: 0,
        completed: 0,
        name: user.name
      };
    });
    
    tasks.forEach(task => {
      task.assignees.forEach(userId => {
        if (userId in userTaskCounts) {
          userTaskCounts[userId].total++;
          if (task.status === "done") {
            userTaskCounts[userId].completed++;
          }
        }
      });
    });
    
    return Object.values(userTaskCounts)
      .filter(data => data.total > 0)
      .sort((a, b) => b.total - a.total);
  };
  
  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF report
    alert("PDF export functionality would be implemented here");
  };
  
  const handleExportExcel = () => {
    // In a real app, this would generate and download an Excel report
    alert("Excel export functionality would be implemented here");
  };
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Icon icon="lucide:loader" className="text-primary text-2xl animate-spin mr-2" />
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button 
            variant="flat" 
            color="primary"
            startContent={<Icon icon="lucide:file" />}
            onPress={handleExportPDF}
          >
            Export PDF
          </Button>
          <Button 
            variant="flat" 
            color="success"
            startContent={<Icon icon="lucide:file-spreadsheet" />}
            onPress={handleExportExcel}
          >
            Export Excel
          </Button>
        </div>
      </div>
      
      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={setSelectedTab}
        aria-label="Report tabs"
        variant="underlined"
        classNames={{
          tabList: "gap-6",
        }}
      >
        <Tab key="taskStatus" title="Task Status">
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Task Status Distribution</h2>
              </CardHeader>
              <Divider />
              <CardBody className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getTaskStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getTaskStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Task Priority Distribution</h2>
              </CardHeader>
              <Divider />
              <CardBody className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getTaskPriorityData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getTaskPriorityData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>
        </Tab>
        
        <Tab key="userWorkload" title="User Workload">
          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">User Task Distribution</h2>
              </CardHeader>
              <Divider />
              <CardBody className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getUserWorkloadData()}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" name="Total Tasks" fill="#3b82f6" />
                    <Bar dataKey="completed" name="Completed Tasks" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>
        </Tab>
        
        <Tab key="timeline" title="Timeline Analysis">
          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Timeline Analysis</h2>
              </CardHeader>
              <Divider />
              <CardBody className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Icon icon="lucide:bar-chart" className="text-default-300 text-6xl mb-4" />
                  <p className="text-default-500">Timeline analysis would be implemented here</p>
                  <p className="text-sm text-default-400 mt-2">
                    This would show task completion trends over time
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};