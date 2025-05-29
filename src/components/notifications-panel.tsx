import React from "react";
import { Icon } from "@iconify/react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerBody,
  Button,
  Avatar,
  Divider
} from "@heroui/react";
import { Notification, User } from "../types/data-types";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  users: User[];
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ 
  isOpen, 
  onClose,
  notifications,
  users
}) => {
  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };
  
  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mention": return "lucide:at-sign";
      case "comment": return "lucide:message-circle";
      case "deadline": return "lucide:clock";
      case "assignment": return "lucide:user-plus";
      default: return "lucide:bell";
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "mention": return "text-primary";
      case "comment": return "text-secondary";
      case "deadline": return "text-warning";
      case "assignment": return "text-success";
      default: return "text-default-500";
    }
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} placement="right" size="sm">
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-default-500">
                  {notifications.filter(n => !n.read).length} unread notifications
                </p>
              </div>
              <div className="flex">
                <Button variant="light" color="primary" size="sm">
                  Mark all as read
                </Button>
                <Button isIconOnly variant="light" onPress={onClose} className="ml-2">
                  <Icon icon="lucide:x" />
                </Button>
              </div>
            </DrawerHeader>
            
            <Divider />
            
            <DrawerBody>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Icon icon="lucide:bell-off" className="text-4xl text-default-300 mb-4" />
                  <p className="text-default-500">No notifications yet</p>
                  <p className="text-sm text-default-400">
                    When you get notifications, they'll show up here
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => {
                    const user = getUserById(notification.userId);
                    
                    return (
                      <div 
                        key={notification.id} 
                        className={`p-3 rounded-md flex items-start ${
                          !notification.read ? 'bg-primary/5' : 'hover:bg-content2'
                        }`}
                      >
                        <div className="relative mr-3">
                          <Avatar 
                            src={user?.avatar} 
                            name={user?.name} 
                            size="md" 
                          />
                          <div className={`absolute -bottom-1 -right-1 rounded-full p-1 bg-content1 ${getNotificationColor(notification.type)}`}>
                            <Icon icon={getNotificationIcon(notification.type)} size={12} />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{user?.name}</span>
                            <span className="text-xs text-default-400">
                              {formatNotificationTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{notification.message}</p>
                          
                          {notification.taskId && (
                            <div className="mt-2">
                              <Button 
                                size="sm" 
                                variant="flat" 
                                color="primary" 
                                className="text-xs"
                              >
                                View Task
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};