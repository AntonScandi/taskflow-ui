import React from "react";
import { Icon } from "@iconify/react";
import { 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Input,
  Badge,
  DateRangePicker
} from "@heroui/react";
import { parseDate } from "@internationalized/date";

interface TopToolbarProps {
  onNotificationsClick: () => void;
  notificationCount: number;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ 
  onNotificationsClick,
  notificationCount
}) => {
  return (
    <header className="h-16 border-b border-divider bg-content1 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold mr-8">Dashboard</h2>
        
        <div className="flex items-center space-x-3">
          <Dropdown>
            <DropdownTrigger>
              <Button 
                variant="flat" 
                color="default" 
                endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
              >
                All Projects
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Project selection">
              <DropdownItem key="all">All Projects</DropdownItem>
              <DropdownItem key="website">Website Redesign</DropdownItem>
              <DropdownItem key="mobile">Mobile App</DropdownItem>
              <DropdownItem key="marketing">Marketing Campaign</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          
          <Dropdown>
            <DropdownTrigger>
              <Button 
                variant="flat" 
                color="default" 
                endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
              >
                Assignee
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Assignee selection">
              <DropdownItem key="all">All Members</DropdownItem>
              <DropdownItem key="alex">Alex Morgan</DropdownItem>
              <DropdownItem key="taylor">Taylor Swift</DropdownItem>
              <DropdownItem key="jordan">Jordan Lee</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          
          <DateRangePicker 
            label="Date Range" 
            className="max-w-xs"
            defaultValue={{
              start: parseDate("2023-06-01"),
              end: parseDate("2023-06-30")
            }}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Input
          classNames={{
            base: "max-w-[240px]",
            inputWrapper: "h-9"
          }}
          placeholder="Search tasks..."
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
        />
        
        <Button 
          isIconOnly 
          variant="light" 
          onPress={onNotificationsClick}
          aria-label="Notifications"
        >
          <Badge color="danger" content={notificationCount} isInvisible={notificationCount === 0}>
            <Icon icon="lucide:bell" className="text-xl" />
          </Badge>
        </Button>
        
        <Button 
          isIconOnly 
          variant="light"
          aria-label="Help"
        >
          <Icon icon="lucide:help-circle" className="text-xl" />
        </Button>
      </div>
    </header>
  );
};