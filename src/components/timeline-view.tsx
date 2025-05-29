import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, Avatar, Tooltip, Badge } from "@heroui/react";
import { Task, User, Project } from "../types/data-types";

interface TimelineViewProps {
  tasks: Task[];
  users: User[];
  projects: Project[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks, users, projects }) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 30);
  
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayWidth = 40;
  const timelineWidth = totalDays * dayWidth;
  
  const getDayPosition = (date: Date) => {
    const diffTime = Math.abs(date.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * dayWidth;
  };
  
  const getTaskWidth = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays * dayWidth, 40); // Minimum width of 40px
  };
  
  const getTaskColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-task-low";
      case "medium": return "bg-task-medium";
      case "high": return "bg-task-high";
      default: return "bg-default-300";
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };
  
  const generateDays = () => {
    const days = [];
    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const isToday = currentDate.toDateString() === today.toDateString();
      
      days.push(
        <div 
          key={i} 
          className={`flex-shrink-0 w-[${dayWidth}px] border-r border-divider text-center py-2 ${
            isWeekend ? 'bg-content2/50' : ''
          } ${isToday ? 'bg-primary/10' : ''}`}
          style={{ width: `${dayWidth}px` }}
        >
          <div className="text-xs font-medium">
            {formatDate(currentDate)}
          </div>
          <div className="text-[10px] text-default-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDate.getDay()]}
          </div>
        </div>
      );
    }
    return days;
  };
  
  const getAssigneeAvatar = (assigneeId: string) => {
    const user = users.find(user => user.id === assigneeId);
    return user ? user.avatar : "";
  };
  
  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const renderDependencyArrows = () => {
    return tasks
      .filter(task => task.dependencies && task.dependencies.length > 0)
      .map(task => {
        return task.dependencies.map(depId => {
          const dependencyTask = tasks.find(t => t.id === depId);
          if (!dependencyTask || !task.startDate || !dependencyTask.endDate) return null;
          
          const startX = getDayPosition(new Date(dependencyTask.endDate));
          const endX = getDayPosition(new Date(task.startDate));
          const startY = tasks.findIndex(t => t.id === depId) * 60 + 30;
          const endY = tasks.findIndex(t => t.id === task.id) * 60 + 30;
          
          // Simple right-angle arrow
          return (
            <svg 
              key={`${task.id}-${depId}`} 
              className="absolute top-0 left-0 pointer-events-none"
              style={{ width: `${timelineWidth}px`, height: "100%" }}
            >
              <path
                className="dependency-arrow"
                d={`M${startX},${startY} L${startX + 10},${startY} L${startX + 10},${endY} L${endX},${endY}`}
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 6 3, 0 6" fill="#a1a1aa" />
                </marker>
              </defs>
            </svg>
          );
        });
      });
  };

  return (
    <Card className="h-full">
      <CardBody className="p-0 h-full">
        <div className="flex h-full">
          {/* Left sidebar with task names */}
          <div className="w-64 flex-shrink-0 border-r border-divider">
            <div className="h-14 border-b border-divider flex items-center px-4 font-medium">
              Task / Project
            </div>
            <div className="overflow-y-auto" style={{ height: "calc(100% - 56px)" }}>
              {tasks.map((task, index) => {
                const project = getProjectById(task.projectId);
                return (
                  <div 
                    key={task.id} 
                    className="h-[60px] border-b border-divider flex flex-col justify-center px-4"
                  >
                    <div className="font-medium text-sm truncate">{task.title}</div>
                    {project && (
                      <div className="text-xs text-default-500 flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-1" 
                          style={{ backgroundColor: project.color }}
                        ></div>
                        {project.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right timeline area */}
          <div className="flex-1 overflow-auto">
            {/* Timeline header */}
            <div className="flex border-b border-divider h-14 sticky top-0 bg-content1 z-10">
              {generateDays()}
            </div>
            
            {/* Timeline content */}
            <div className="relative" style={{ minWidth: `${timelineWidth}px` }}>
              {/* Today indicator */}
              <div 
                className="absolute top-0 bottom-0 w-px bg-primary z-10" 
                style={{ left: `${getDayPosition(today)}px` }}
              ></div>
              
              {/* Task bars */}
              {tasks.map((task, index) => {
                if (!task.startDate || !task.endDate) return null;
                
                const left = getDayPosition(new Date(task.startDate));
                const width = getTaskWidth(task.startDate, task.endDate);
                
                return (
                  <div 
                    key={task.id}
                    className="absolute h-8 timeline-task rounded-md flex items-center px-2 cursor-pointer"
                    style={{
                      left: `${left}px`,
                      top: `${index * 60 + 16}px`,
                      width: `${width}px`,
                      backgroundColor: getTaskColor(task.priority)
                    }}
                  >
                    <Tooltip content={task.title}>
                      <div className="flex items-center justify-between w-full">
                        <div className="text-xs font-medium text-white truncate mr-2">
                          {task.title}
                        </div>
                        {task.assignees && task.assignees.length > 0 && (
                          <Avatar 
                            src={getAssigneeAvatar(task.assignees[0])} 
                            size="sm" 
                            className="flex-shrink-0"
                          />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                );
              })}
              
              {/* Dependency arrows */}
              {renderDependencyArrows()}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};