import React from "react";
import { 
  Card, 
  CardBody,
  CardHeader,
  Divider,
  Avatar,
  AvatarGroup,
  Chip,
  Button,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Progress,
  Checkbox
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Task, User, Comment } from "../../types/data-types";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface TaskDetailProps {
  taskId: string;
  onClose: () => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, onClose }) => {
  const [task, setTask] = React.useState<Task | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [subtasks, setSubtasks] = React.useState<{id: string; title: string; completed: boolean}[]>([]);
  const [newSubtask, setNewSubtask] = React.useState("");
  
  const { authState } = useAuth();
  const currentUser = authState.user;
  
  React.useEffect(() => {
    const fetchTaskDetails = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be proper API calls
        const taskResponse = await api.get(`/tasks/${taskId}`);
        const usersResponse = await api.get("/users");
        const commentsResponse = await api.get(`/tasks/${taskId}/comments`);
        
        setTask(taskResponse.data);
        setUsers(usersResponse.data);
        setComments(commentsResponse.data);
        
        // Mock subtasks for demo
        setSubtasks([
          { id: "sub1", title: "Research competitors", completed: true },
          { id: "sub2", title: "Create initial sketches", completed: true },
          { id: "sub3", title: "Get feedback from team", completed: false }
        ]);
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTaskDetails();
  }, [taskId]);
  
  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;
    
    try {
      const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  
  const handlePriorityChange = async (newPriority: string) => {
    if (!task) return;
    
    try {
      const response = await api.put(`/tasks/${taskId}`, { priority: newPriority });
      setTask({ ...task, priority: newPriority });
    } catch (error) {
      console.error("Error updating task priority:", error);
    }
  };
  
  const handleProgressChange = async (newProgress: number) => {
    if (!task) return;
    
    try {
      const response = await api.put(`/tasks/${taskId}`, { progress: newProgress });
      setTask({ ...task, progress: newProgress });
    } catch (error) {
      console.error("Error updating task progress:", error);
    }
  };
  
  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, {
        userId: currentUser.id,
        content: newComment,
        mentions: [] // In a real app, we'd parse @mentions here
      });
      
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const newSubtaskItem = {
      id: `sub${Date.now()}`,
      title: newSubtask,
      completed: false
    };
    
    setSubtasks([...subtasks, newSubtaskItem]);
    setNewSubtask("");
  };
  
  const handleSubtaskToggle = (subtaskId: string) => {
    setSubtasks(subtasks.map(subtask => 
      subtask.id === subtaskId 
        ? { ...subtask, completed: !subtask.completed } 
        : subtask
    ));
  };
  
  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "default";
      case "inProgress": return "primary";
      case "done": return "success";
      default: return "default";
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "success";
      case "medium": return "warning";
      case "high": return "danger";
      default: return "default";
    }
  };
  
  if (isLoading || !task) {
    return (
      <Card className="w-full h-full">
        <CardBody className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Icon icon="lucide:loader" className="text-primary text-2xl animate-spin mb-2" />
            <p>Loading task details...</p>
          </div>
        </CardBody>
      </Card>
    );
  }
  
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const subtaskProgress = subtasks.length > 0 
    ? Math.round((completedSubtasks / subtasks.length) * 100) 
    : 0;
  
  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <Chip 
            color={getStatusColor(task.status)} 
            variant="flat"
            size="sm"
          >
            {task.status === "todo" ? "To Do" : 
             task.status === "inProgress" ? "In Progress" : "Done"}
          </Chip>
        </div>
        <Button 
          isIconOnly 
          variant="light" 
          onPress={onClose}
          aria-label="Close"
        >
          <Icon icon="lucide:x" />
        </Button>
      </CardHeader>
      
      <Divider />
      
      <CardBody className="overflow-y-auto p-0">
        <div className="flex flex-col md:flex-row h-full">
          {/* Main task content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-default-500 mb-2">Description</h3>
                <p className="text-foreground">{task.description || "No description provided."}</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-default-500">Subtasks ({completedSubtasks}/{subtasks.length})</h3>
                  <span className="text-sm text-default-500">{subtaskProgress}% complete</span>
                </div>
                <Progress 
                  value={subtaskProgress} 
                  color="primary" 
                  size="sm"
                  className="mb-3"
                />
                
                <div className="space-y-2">
                  {subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center">
                      <Checkbox 
                        isSelected={subtask.completed}
                        onValueChange={() => handleSubtaskToggle(subtask.id)}
                      >
                        <span className={subtask.completed ? "line-through text-default-400" : ""}>
                          {subtask.title}
                        </span>
                      </Checkbox>
                    </div>
                  ))}
                  
                  <div className="flex mt-2">
                    <Textarea
                      placeholder="Add a subtask..."
                      value={newSubtask}
                      onValueChange={setNewSubtask}
                      minRows={1}
                      className="flex-1 mr-2"
                    />
                    <Button 
                      color="primary" 
                      isIconOnly
                      onPress={handleAddSubtask}
                      isDisabled={!newSubtask.trim()}
                    >
                      <Icon icon="lucide:plus" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-default-500 mb-2">Comments</h3>
                
                <div className="space-y-4">
                  {comments.map(comment => {
                    const user = getUserById(comment.userId);
                    
                    return (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar 
                          src={user?.avatar} 
                          name={user?.name} 
                          size="sm"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{user?.name}</span>
                            <span className="text-xs text-default-400">
                              {formatDateTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {comments.length === 0 && (
                    <p className="text-default-400 text-sm">No comments yet.</p>
                  )}
                  
                  <div className="flex gap-3 mt-4">
                    <Avatar 
                      src={currentUser?.avatar} 
                      name={currentUser?.name} 
                      size="sm"
                    />
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onValueChange={setNewComment}
                        minRows={2}
                      />
                      <Button 
                        color="primary" 
                        size="sm"
                        className="mt-2"
                        onPress={handleAddComment}
                        isDisabled={!newComment.trim()}
                      >
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar with task details */}
          <div className="w-full md:w-64 bg-content2/50 p-4 border-t md:border-t-0 md:border-l border-divider">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-default-500 mb-2">Status</h3>
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="flat" 
                      color={getStatusColor(task.status)}
                      className="w-full justify-between"
                    >
                      {task.status === "todo" ? "To Do" : 
                       task.status === "inProgress" ? "In Progress" : "Done"}
                      <Icon icon="lucide:chevron-down" className="text-sm" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Status options"
                    onAction={(key) => handleStatusChange(key as string)}
                  >
                    <DropdownItem key="todo">To Do</DropdownItem>
                    <DropdownItem key="inProgress">In Progress</DropdownItem>
                    <DropdownItem key="done">Done</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-default-500 mb-2">Priority</h3>
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="flat" 
                      color={getPriorityColor(task.priority)}
                      className="w-full justify-between"
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      <Icon icon="lucide:chevron-down" className="text-sm" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Priority options"
                    onAction={(key) => handlePriorityChange(key as string)}
                  >
                    <DropdownItem key="low">Low</DropdownItem>
                    <DropdownItem key="medium">Medium</DropdownItem>
                    <DropdownItem key="high">High</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-default-500 mb-2">Assignees</h3>
                <div className="flex items-center">
                  <AvatarGroup max={3} size="sm" isBordered>
                    {task.assignees.map(assigneeId => {
                      const user = getUserById(assigneeId);
                      return user ? (
                        <Avatar 
                          key={user.id} 
                          src={user.avatar} 
                          name={user.name} 
                        />
                      ) : null;
                    })}
                  </AvatarGroup>
                  <Button 
                    isIconOnly 
                    variant="light" 
                    size="sm"
                    className="ml-2"
                  >
                    <Icon icon="lucide:plus" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-default-500 mb-2">Dates</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-default-400">Start Date</p>
                    <p className="text-sm">{formatDate(task.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-default-400">Due Date</p>
                    <p className="text-sm">{formatDate(task.dueDate)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-default-500 mb-2">Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Overall Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress 
                    value={task.progress} 
                    color={task.progress === 100 ? "success" : "primary"} 
                    size="sm"
                  />
                  <div className="flex justify-between mt-2">
                    <Button 
                      size="sm" 
                      variant="flat" 
                      onPress={() => handleProgressChange(Math.max(0, (task.progress || 0) - 10))}
                      isDisabled={(task.progress || 0) <= 0}
                    >
                      -10%
                    </Button>
                    <Button 
                      size="sm" 
                      variant="flat" 
                      onPress={() => handleProgressChange(Math.min(100, (task.progress || 0) + 10))}
                      isDisabled={(task.progress || 0) >= 100}
                    >
                      +10%
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};