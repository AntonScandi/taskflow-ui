import React from "react";
import { 
  Card, 
  CardBody, 
  CardHeader,
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Project } from "../../types/data-types";
import { api } from "../../services/api";

export const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { 
    isOpen: isCreateOpen, 
    onOpen: onCreateOpen, 
    onOpenChange: onCreateOpenChange 
  } = useDisclosure();
  
  const [newProject, setNewProject] = React.useState({
    name: "",
    description: "",
    color: "#3b82f6"
  });
  
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    onOpen();
  };
  
  const handleCreateProject = async () => {
    try {
      const response = await api.post("/projects", newProject);
      
      // Add the new project to the list
      setProjects([...projects, response.data]);
      
      // Reset form and close modal
      setNewProject({
        name: "",
        description: "",
        color: "#3b82f6"
      });
      onCreateOpenChange(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
  
  const colorOptions = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f59e0b" },
    { name: "Pink", value: "#ec4899" }
  ];
  
  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Project Management</h2>
          <Button 
            color="primary" 
            startContent={<Icon icon="lucide:plus" />}
            onPress={onCreateOpen}
          >
            Create Project
          </Button>
        </CardHeader>
        
        <CardBody>
          <Table 
            aria-label="Projects table"
            removeWrapper
            isStriped
          >
            <TableHeader>
              <TableColumn>PROJECT</TableColumn>
              <TableColumn>TASKS</TableColumn>
              <TableColumn>MEMBERS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody 
              isLoading={isLoading}
              loadingContent={<div className="py-8 text-center">Loading projects...</div>}
              emptyContent={<div className="py-8 text-center">No projects found</div>}
            >
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: project.color }}
                      ></div>
                      <span className="font-medium">{project.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* In a real app, we'd count tasks for this project */}
                    {Math.floor(Math.random() * 10) + 1} tasks
                  </TableCell>
                  <TableCell>
                    {/* In a real app, we'd show project members */}
                    {Math.floor(Math.random() * 5) + 1} members
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="flat"
                        size="sm"
                        onPress={() => handleProjectSelect(project)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="light"
                        size="sm"
                        color="danger"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      
      {/* Project Details Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Project Details
              </ModalHeader>
              <ModalBody>
                {selectedProject && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: selectedProject.color }}
                      ></div>
                      <h3 className="text-lg font-semibold">{selectedProject.name}</h3>
                    </div>
                    
                    <div>
                      <p className="text-sm text-default-500">Description</p>
                      <p>{selectedProject.description || "No description provided."}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-default-500">Project Members</p>
                      <p>This feature would show project members in a real app.</p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      {/* Create Project Modal */}
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Project
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Project Name"
                    placeholder="Enter project name"
                    value={newProject.name}
                    onValueChange={(value) => setNewProject({...newProject, name: value})}
                  />
                  
                  <Input
                    label="Description"
                    placeholder="Enter project description"
                    value={newProject.description}
                    onValueChange={(value) => setNewProject({...newProject, description: value})}
                  />
                  
                  <div>
                    <p className="text-sm mb-2">Project Color</p>
                    <div className="flex gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          className={`w-8 h-8 rounded-full ${
                            newProject.color === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setNewProject({...newProject, color: color.value})}
                          aria-label={`Select ${color.name} color`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleCreateProject}
                  isDisabled={!newProject.name}
                >
                  Create Project
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};