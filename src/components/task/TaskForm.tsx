import React from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Divider
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { DateRangePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { User, Project } from "../../types/data-types";
import { api } from "../../services/api";

interface TaskFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onTaskCreated?: () => void;
  projectId?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onOpenChange,
  onTaskCreated,
  projectId: initialProjectId
}) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState("medium");
  const [projectId, setProjectId] = React.useState(initialProjectId || "");
  const [assignees, setAssignees] = React.useState<string[]>([]);
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  
  const [users, setUsers] = React.useState<User[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
          api.get("/users"),
          api.get("/projects")
        ]);
        
        setUsers(usersResponse.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSubmit = async () => {
    if (!title || !projectId) return;
    
    setIsLoading(true);
    
    try {
      const taskData = {
        title,
        description,
        priority,
        projectId,
        assignees,
        startDate,
        endDate,
        dueDate: endDate,
        status: "todo",
        progress: 0
      };
      
      await api.post("/tasks", taskData);
      
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setProjectId(initialProjectId || "");
      setAssignees([]);
      setStartDate("");
      setEndDate("");
      
      onOpenChange(false);
      if (onTaskCreated) onTaskCreated();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDateChange = (range: { start: any; end: any }) => {
    setStartDate(range.start.toString());
    setEndDate(range.end.toString());
  };
  
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setAssignees(selectedOptions);
  };
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create New Task
            </ModalHeader>
            
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Task Title"
                  placeholder="Enter task title"
                  value={title}
                  onValueChange={setTitle}
                  isRequired
                />
                
                <Textarea
                  label="Description"
                  placeholder="Enter task description"
                  value={description}
                  onValueChange={setDescription}
                  minRows={3}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Project"
                    placeholder="Select a project"
                    selectedKeys={projectId ? [projectId] : []}
                    onChange={(e) => setProjectId(e.target.value)}
                    isRequired
                  >
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: project.color }}
                          ></div>
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    label="Priority"
                    selectedKeys={[priority]}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <SelectItem key="low" value="low">
                      <div className="flex items-center gap-2">
                        <Chip color="success" size="sm" variant="flat">Low</Chip>
                      </div>
                    </SelectItem>
                    <SelectItem key="medium" value="medium">
                      <div className="flex items-center gap-2">
                        <Chip color="warning" size="sm" variant="flat">Medium</Chip>
                      </div>
                    </SelectItem>
                    <SelectItem key="high" value="high">
                      <div className="flex items-center gap-2">
                        <Chip color="danger" size="sm" variant="flat">High</Chip>
                      </div>
                    </SelectItem>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Assignees</label>
                  <select
                    multiple
                    className="w-full rounded-md border-default-200 bg-content1 px-3 py-2 text-sm"
                    onChange={handleAssigneeChange}
                    value={assignees}
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-default-400 mt-1">
                    Hold Ctrl/Cmd to select multiple users
                  </p>
                </div>
                
                <Divider />
                
                <div>
                  <label className="block text-sm font-medium mb-2">Date Range</label>
                  <DateRangePicker
                    className="w-full"
                    onChange={handleDateChange}
                  />
                </div>
              </div>
            </ModalBody>
            
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onPress={handleSubmit}
                isLoading={isLoading}
                isDisabled={!title || !projectId}
              >
                Create Task
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};