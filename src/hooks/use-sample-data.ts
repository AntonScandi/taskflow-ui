import React from "react";
import { Task, User, Project, Notification } from "../types/data-types";

export const useSampleData = () => {
  const users: User[] = React.useMemo(() => [
    {
      id: "user1",
      name: "Alex Morgan",
      avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
      role: "Product Manager"
    },
    {
      id: "user2",
      name: "Taylor Swift",
      avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=2",
      role: "UI Designer"
    },
    {
      id: "user3",
      name: "Jordan Lee",
      avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=3",
      role: "Developer"
    },
    {
      id: "user4",
      name: "Sam Wilson",
      avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=4",
      role: "QA Engineer"
    }
  ], []);

  const projects: Project[] = React.useMemo(() => [
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
  ], []);

  const tasks: Task[] = React.useMemo(() => [
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
    },
    {
      id: "task3",
      title: "Frontend development",
      description: "Implement the new homepage design",
      status: "inProgress",
      priority: "high",
      assignees: ["user3"],
      startDate: "2023-06-06",
      endDate: "2023-06-15",
      dueDate: "2023-06-15",
      progress: 60,
      dependencies: ["task1"],
      projectId: "project1"
    },
    {
      id: "task4",
      title: "Backend API",
      description: "Create REST endpoints for the new features",
      status: "inProgress",
      priority: "medium",
      assignees: ["user3", "user4"],
      startDate: "2023-06-08",
      endDate: "2023-06-18",
      dueDate: "2023-06-18",
      progress: 30,
      projectId: "project1"
    },
    {
      id: "task5",
      title: "QA Testing",
      description: "Test all new features and fix bugs",
      status: "todo",
      priority: "medium",
      assignees: ["user4"],
      startDate: "2023-06-16",
      endDate: "2023-06-22",
      dueDate: "2023-06-22",
      progress: 0,
      dependencies: ["task3", "task4"],
      projectId: "project1"
    },
    {
      id: "task6",
      title: "App design",
      description: "Create UI design for the mobile app",
      status: "inProgress",
      priority: "high",
      assignees: ["user2"],
      startDate: "2023-06-05",
      endDate: "2023-06-12",
      dueDate: "2023-06-12",
      progress: 80,
      projectId: "project2"
    },
    {
      id: "task7",
      title: "Content strategy",
      description: "Develop content plan for the marketing campaign",
      status: "todo",
      priority: "low",
      assignees: ["user1"],
      startDate: "2023-06-10",
      endDate: "2023-06-15",
      dueDate: "2023-06-15",
      progress: 0,
      projectId: "project3"
    },
    {
      id: "task8",
      title: "Social media assets",
      description: "Create graphics for social media campaign",
      status: "todo",
      priority: "low",
      assignees: ["user2"],
      startDate: "2023-06-16",
      endDate: "2023-06-20",
      dueDate: "2023-06-20",
      progress: 0,
      dependencies: ["task7"],
      projectId: "project3"
    }
  ], []);

  const notifications: Notification[] = React.useMemo(() => [
    {
      id: "notif1",
      type: "mention",
      userId: "user2",
      message: "mentioned you in a comment on 'Create wireframes'",
      timestamp: "2023-06-08T14:32:00",
      read: false,
      taskId: "task1"
    },
    {
      id: "notif2",
      type: "deadline",
      userId: "user1",
      message: "Reminder: 'Frontend development' is due tomorrow",
      timestamp: "2023-06-08T09:15:00",
      read: false,
      taskId: "task3"
    },
    {
      id: "notif3",
      type: "comment",
      userId: "user3",
      message: "commented on 'Backend API'",
      timestamp: "2023-06-07T16:45:00",
      read: true,
      taskId: "task4"
    },
    {
      id: "notif4",
      type: "assignment",
      userId: "user1",
      message: "assigned you to 'QA Testing'",
      timestamp: "2023-06-07T11:20:00",
      read: true,
      taskId: "task5"
    }
  ], []);

  return { users, projects, tasks, notifications };
};
