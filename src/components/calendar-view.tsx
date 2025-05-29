import React from "react";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody, Badge } from "@heroui/react";
import { Task } from "../types/data-types";

interface CalendarViewProps {
  tasks: Task[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<"month" | "week">("month");
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const getMonthName = (month: number) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2000, month, 1));
  };
  
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-task-low text-white";
      case "medium": return "bg-task-medium text-white";
      case "high": return "bg-task-high text-white";
      default: return "bg-default-200 text-default-800";
    }
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Render weekday headers
    const weekdayHeaders = weekdays.map(day => (
      <div key={day} className="text-center font-medium py-2 border-b border-divider">
        {day}
      </div>
    ));
    
    // Fill in empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="border border-divider bg-content2/30"></div>
      );
    }
    
    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = 
        today.getDate() === day && 
        today.getMonth() === month && 
        today.getFullYear() === year;
      
      const tasksForDay = getTasksForDate(date);
      
      days.push(
        <div 
          key={day} 
          className={`border border-divider p-1 calendar-day overflow-y-auto ${
            isToday ? 'bg-primary/5 border-primary/30' : ''
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm ${isToday ? 'font-bold text-primary' : ''}`}>
              {day}
            </span>
            {tasksForDay.length > 0 && (
              <Badge color="primary" size="sm" content={tasksForDay.length} />
            )}
          </div>
          
          <div className="space-y-1">
            {tasksForDay.slice(0, 3).map(task => (
              <div 
                key={task.id} 
                className={`calendar-event ${getPriorityColor(task.priority)}`}
              >
                {task.title}
              </div>
            ))}
            
            {tasksForDay.length > 3 && (
              <div className="text-xs text-default-500 pl-1">
                +{tasksForDay.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-7 gap-0">
          {weekdayHeaders}
        </div>
        <div className="grid grid-cols-7 gap-0 flex-1">
          {days}
        </div>
      </div>
    );
  };
  
  const renderWeekView = () => {
    const currentDay = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDay);
    
    const weekDays = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      
      const isToday = 
        today.getDate() === date.getDate() && 
        today.getMonth() === date.getMonth() && 
        today.getFullYear() === date.getFullYear();
      
      const tasksForDay = getTasksForDate(date);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      const formattedDate = date.getDate();
      
      weekDays.push(
        <div 
          key={i} 
          className={`flex-1 border border-divider overflow-y-auto ${
            isToday ? 'bg-primary/5 border-primary/30' : ''
          }`}
        >
          <div 
            className={`sticky top-0 bg-content2 p-2 border-b border-divider text-center ${
              isToday ? 'text-primary font-medium' : ''
            }`}
          >
            <div className="text-sm font-medium">{dayName}</div>
            <div className="text-lg">{formattedDate}</div>
          </div>
          
          <div className="p-2 space-y-2">
            {tasksForDay.map(task => (
              <div 
                key={task.id} 
                className={`p-2 rounded-md ${getPriorityColor(task.priority)}`}
              >
                <div className="font-medium">{task.title}</div>
                {task.description && (
                  <div className="text-xs mt-1 opacity-90 line-clamp-2">{task.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex h-full">
        {weekDays}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardBody className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">
              {viewMode === "month" 
                ? `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}` 
                : `Week of ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
                    new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()))
                  )}`
              }
            </h2>
            <div className="ml-4 flex">
              <Button 
                isIconOnly 
                variant="light" 
                onPress={viewMode === "month" ? prevMonth : prevWeek}
                aria-label="Previous"
              >
                <Icon icon="lucide:chevron-left" />
              </Button>
              <Button 
                isIconOnly 
                variant="light" 
                onPress={viewMode === "month" ? nextMonth : nextWeek}
                aria-label="Next"
              >
                <Icon icon="lucide:chevron-right" />
              </Button>
              <Button 
                variant="light" 
                onPress={() => setCurrentDate(new Date())}
                className="ml-2"
              >
                Today
              </Button>
            </div>
          </div>
          
          <div className="flex">
            <Button 
              variant={viewMode === "month" ? "flat" : "light"} 
              color={viewMode === "month" ? "primary" : "default"}
              onPress={() => setViewMode("month")}
              className="rounded-r-none"
            >
              Month
            </Button>
            <Button 
              variant={viewMode === "week" ? "flat" : "light"} 
              color={viewMode === "week" ? "primary" : "default"}
              onPress={() => setViewMode("week")}
              className="rounded-l-none"
            >
              Week
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {viewMode === "month" ? renderMonthView() : renderWeekView()}
        </div>
      </CardBody>
    </Card>
  );
};