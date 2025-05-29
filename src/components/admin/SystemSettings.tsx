import React from "react";
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Switch,
  RadioGroup,
  Radio,
  Button,
  Input
} from "@heroui/react";
import { Icon } from "@iconify/react";

export const SystemSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [taskReminders, setTaskReminders] = React.useState(true);
  const [commentNotifications, setCommentNotifications] = React.useState(true);
  const [defaultTaskView, setDefaultTaskView] = React.useState("kanban");
  const [companyName, setCompanyName] = React.useState("TaskFlow");
  const [supportEmail, setSupportEmail] = React.useState("support@taskflow.example.com");
  
  const handleSaveSettings = () => {
    // In a real app, this would save settings to the backend
    console.log("Settings saved:", {
      emailNotifications,
      taskReminders,
      commentNotifications,
      defaultTaskView,
      companyName,
      supportEmail
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </CardHeader>
        
        <CardBody className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-default-500">
                Send email notifications for important events
              </p>
            </div>
            <Switch 
              isSelected={emailNotifications} 
              onValueChange={setEmailNotifications}
            />
          </div>
          
          <Divider />
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Task Reminders</p>
              <p className="text-sm text-default-500">
                Send reminders for upcoming and overdue tasks
              </p>
            </div>
            <Switch 
              isSelected={taskReminders} 
              onValueChange={setTaskReminders}
            />
          </div>
          
          <Divider />
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Comment Notifications</p>
              <p className="text-sm text-default-500">
                Notify users when they are mentioned in comments
              </p>
            </div>
            <Switch 
              isSelected={commentNotifications} 
              onValueChange={setCommentNotifications}
            />
          </div>
        </CardBody>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Display Settings</h2>
        </CardHeader>
        
        <CardBody className="space-y-4">
          <div>
            <p className="font-medium mb-2">Default Task View</p>
            <RadioGroup 
              value={defaultTaskView}
              onValueChange={setDefaultTaskView}
            >
              <Radio value="list">List View</Radio>
              <Radio value="kanban">Kanban Board</Radio>
              <Radio value="calendar">Calendar View</Radio>
              <Radio value="timeline">Timeline View</Radio>
            </RadioGroup>
          </div>
        </CardBody>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Company Settings</h2>
        </CardHeader>
        
        <CardBody className="space-y-4">
          <Input
            label="Company Name"
            value={companyName}
            onValueChange={setCompanyName}
          />
          
          <Input
            label="Support Email"
            type="email"
            value={supportEmail}
            onValueChange={setSupportEmail}
          />
          
          <div className="flex justify-end mt-4">
            <Button 
              color="primary"
              onPress={handleSaveSettings}
              startContent={<Icon icon="lucide:save" />}
            >
              Save Settings
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};