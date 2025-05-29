import React from "react";
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Progress,
  Button,
  Chip,
  useDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Task, User } from "../../types/data-types";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { TaskDetail } from "../task/TaskDetail";

export const UserDashboard: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedTask, setSelectedTask] = React.useState<string | null>(null);
  
  const { authState } = useAuth();
  const currentUser = authState.user;
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  React.useEffect(() => {
    const fetchUserTasks = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        const response = await api.get(`/tasks?assignee=${currentUser.id}`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching user tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserTasks();
  }, [currentUser]);
  
  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    onOpen();
  };
  
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };
  
  const getTasksByPriority = (priority: string) => {
    return tasks.filter(task => task.priority === priority);
  };
  
  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek && task.status !== "done";
    });
  };
  
  const getOverdueTasks = () => {
    const today = new Date();
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      return dueDate < today && task.status !== "done";
    });
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "success";
      case "medium": return "warning";
      case "high": return "danger";
      default: return "default";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "default";
      case "inProgress": return "primary";
      case "done": return "success";
      default: return "default";
    }
  };
  
  const getCompletionRate = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === "done").length;
    return Math.round((completedTasks / tasks.length) * 100);
  };
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Icon icon="lucide:loader" className="text-primary text-2xl animate-spin mr-2" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Dashboard</h1>
        <Button 
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
        >
          New Task
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-bold text-primary mb-1">
              {getTasksByStatus("todo").length}
            </div>
            <p className="text-default-500">To Do</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-bold text-primary mb-1">
              {getTasksByStatus("inProgress").length}
            </div>
            <p className="text-default-500">In Progress</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-bold text-success mb-1">
              {getTasksByStatus("done").length}
            </div>
            <p className="text-default-500">Completed</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-bold text-danger mb-1">
              {getOverdueTasks().length}
            </div>
            <p className="text-default-500">Overdue</p>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between">
            <h2 className="text-lg font-semibold">My Progress</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-default-500">Overall Completion</span>
                  <span className="font-medium">{getCompletionRate()}%</span>
                </div>
                <Progress 
                  value={getCompletionRate()} 
                  color="primary" 
                  className="h-2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-default-500 mb-1">High Priority</p>
                  <div className="flex items-center">
                    <div className="text-xl font-semibold mr-2">
                      {getTasksByPriority("high").length}
                    </div>
                    <Chip color="danger" size="sm" variant="flat">
                      {getTasksByPriority("high").filter(t => t.status === "done").length} completed
                    </Chip>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-default-500 mb-1">Medium Priority</p>
                  <div className="flex items-center">
                    <div className="text-xl font-semibold mr-2">
                      {getTasksByPriority("medium").length}
                    </div>
                    <Chip color="warning" size="sm" variant="flat">
                      {getTasksByPriority("medium").filter(t => t.status === "done").length} completed
                    </Chip>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-default-500 mb-1">Low Priority</p>
                  <div className="flex items-center">
                    <div className="text-xl font-semibold mr-2">
                      {getTasksByPriority("low").length}
                    </div>
                    <Chip color="success" size="sm" variant="flat">
                      {getTasksByPriority("low").filter(t => t.status === "done").length} completed
                    </Chip>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            {getUpcomingTasks().length > 0 ? (
              <div className="space-y-3">
                {getUpcomingTasks().map(task => (
                  <div 
                    key={task.id}
                    className="p-3 border border-divider rounded-md cursor-pointer hover:bg-content2/50"
                    onClick={() => handleTaskClick(task.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{task.title}</h3>
                      <Chip 
                        color={getPriorityColor(task.priority)} 
                        size="sm"
                        variant="flat"
                      >
                        {task.priority}
                      </Chip>
                    </div>
                    <div className="flex justify-between items-center">
                      <Chip 
                        color={getStatusColor(task.status)} 
                        size="sm"
                        variant="flat"
                      >
                        {task.status === "todo" ? "To Do" : 
                         task.status === "inProgress" ? "In Progress" : "Done"}
                      </Chip>
                      <div className="flex items-center text-xs text-default-500">
                        <Icon icon="lucide:calendar" className="mr-1" size={14} />
                        {formatDate(task.dueDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Icon icon="lucide:calendar-check" className="text-default-300 text-4xl mb-2" />
                <p className="text-default-500">No upcoming deadlines</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
      
      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
          <ModalContent>
            <TaskDetail 
              taskId={selectedTask} 
              onClose={() => onOpenChange(false)} 
            />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

// Add this component to avoid TypeScript errors
const Modal: React.FC<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  size?: string;
  children: React.ReactNode;
}> = ({ isOpen, onOpenChange, size, children }) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-content1 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

const ModalContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="h-full">{children}</div>;
};