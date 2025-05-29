import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, Avatar, AvatarGroup, Progress, Badge, Button } from "@heroui/react";
import { Task, User } from "../types/data-types";

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, users }) => {
  const columns = [
    { id: "todo", title: "To Do", icon: "lucide:list", color: "default" },
    { id: "inProgress", title: "In Progress", icon: "lucide:loader", color: "primary" },
    { id: "done", title: "Done", icon: "lucide:check", color: "success" }
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getAssigneeAvatars = (assigneeIds: string[]) => {
    return assigneeIds.map(id => users.find(user => user.id === id)).filter(Boolean) as User[];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "success";
      case "medium": return "warning";
      case "high": return "danger";
      default: return "default";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "low": return "lucide:arrow-down";
      case "medium": return "lucide:minus";
      case "high": return "lucide:arrow-up";
      default: return "lucide:minus";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="flex h-full space-x-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div 
            key={column.id} 
            className="flex-shrink-0 w-80 flex flex-col bg-content2 rounded-lg"
          >
            <div className="p-3 border-b border-divider flex items-center justify-between">
              <div className="flex items-center">
                <Icon icon={column.icon} className={`text-${column.color} mr-2`} />
                <h3 className="font-medium">{column.title}</h3>
                <Badge content={getTasksByStatus(column.id).length} color="default" size="sm" className="ml-2" />
              </div>
              <Button isIconOnly size="sm" variant="light">
                <Icon icon="lucide:more-horizontal" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 kanban-column">
              {getTasksByStatus(column.id).map((task) => (
                <Card key={task.id} className="task-card">
                  <CardBody className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge 
                        color={getPriorityColor(task.priority)} 
                        variant="flat" 
                        size="sm"
                        startContent={<Icon icon={getPriorityIcon(task.priority)} size={14} />}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      <Button isIconOnly size="sm" variant="light" radius="full">
                        <Icon icon="lucide:more-vertical" size={14} />
                      </Button>
                    </div>
                    
                    <h4 className="font-medium mb-2">{task.title}</h4>
                    
                    {task.description && (
                      <p className="text-sm text-default-500 mb-3 line-clamp-2">{task.description}</p>
                    )}
                    
                    {task.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress 
                          value={task.progress} 
                          color={task.progress === 100 ? "success" : "primary"} 
                          size="sm"
                          aria-label="Task progress"
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <AvatarGroup max={3} size="sm" isBordered>
                        {getAssigneeAvatars(task.assignees).map((user) => (
                          <Avatar 
                            key={user.id} 
                            src={user.avatar} 
                            name={user.name} 
                          />
                        ))}
                      </AvatarGroup>
                      
                      {task.dueDate && (
                        <Badge 
                          variant="flat" 
                          color="default" 
                          size="sm"
                          startContent={<Icon icon="lucide:calendar" size={14} />}
                        >
                          {formatDate(task.dueDate)}
                        </Badge>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
              
              <Button 
                className="w-full mt-2" 
                variant="flat" 
                color="default" 
                startContent={<Icon icon="lucide:plus" />}
              >
                Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};