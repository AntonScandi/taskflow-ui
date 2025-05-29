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
  User as UserComponent,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { User } from "../../types/data-types";
import { api } from "../../services/api";

export const UserManagement: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { 
    isOpen: isInviteOpen, 
    onOpen: onInviteOpen, 
    onOpenChange: onInviteOpenChange 
  } = useDisclosure();
  
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<"admin" | "user">("user");
  
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
    try {
      const response = await api.put(`/users/${userId}`, { roleType: newRole });
      
      // Update users list
      setUsers(users.map(user => 
        user.id === userId ? { ...user, roleType: newRole } : user
      ));
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };
  
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };
  
  const handleInviteSubmit = async () => {
    // In a real app, this would send an invitation email
    // For demo purposes, we'll just create the user directly
    try {
      const response = await api.post("/auth/register", {
        name: inviteEmail.split('@')[0], // Use part of email as name
        email: inviteEmail,
        password: "tempPassword123", // In real app, would generate random password or use magic links
        roleType: inviteRole
      });
      
      // Add the new user to the list
      setUsers([...users, response.data.user]);
      
      // Reset form and close modal
      setInviteEmail("");
      setInviteRole("user");
      onInviteOpenChange(false);
    } catch (error) {
      console.error("Error inviting user:", error);
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "primary";
      case "user": return "success";
      default: return "default";
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">User Management</h2>
          <Button 
            color="primary" 
            startContent={<Icon icon="lucide:user-plus" />}
            onPress={onInviteOpen}
          >
            Invite User
          </Button>
        </CardHeader>
        
        <CardBody>
          <Table 
            aria-label="Users table"
            removeWrapper
            isStriped
          >
            <TableHeader>
              <TableColumn>USER</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody 
              isLoading={isLoading}
              loadingContent={<div className="py-8 text-center">Loading users...</div>}
              emptyContent={<div className="py-8 text-center">No users found</div>}
            >
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <UserComponent
                      name={user.name}
                      description={user.role}
                      avatarProps={{
                        src: user.avatar,
                        size: "sm"
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      color={getRoleColor(user.roleType)}
                      variant="flat"
                      size="sm"
                    >
                      {user.roleType === "admin" ? "Admin" : "User"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button 
                            variant="flat" 
                            size="sm"
                          >
                            Change Role
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Role actions">
                          <DropdownItem 
                            key="admin"
                            onPress={() => handleRoleChange(user.id, "admin")}
                            startContent={<Icon icon="lucide:shield" className="text-primary" />}
                          >
                            Make Admin
                          </DropdownItem>
                          <DropdownItem 
                            key="user"
                            onPress={() => handleRoleChange(user.id, "user")}
                            startContent={<Icon icon="lucide:user" className="text-success" />}
                          >
                            Make User
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                      
                      <Button 
                        variant="light"
                        size="sm"
                        onPress={() => handleUserSelect(user)}
                      >
                        View Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      
      {/* User Details Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                User Details
              </ModalHeader>
              <ModalBody>
                {selectedUser && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={selectedUser.avatar} 
                        alt={selectedUser.name} 
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                        <p className="text-default-500">{selectedUser.role}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-default-500">Email</p>
                      <p>{selectedUser.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-default-500">System Role</p>
                      <Chip 
                        color={getRoleColor(selectedUser.roleType)}
                        variant="flat"
                      >
                        {selectedUser.roleType === "admin" ? "Administrator" : "Regular User"}
                      </Chip>
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
      
      {/* Invite User Modal */}
      <Modal isOpen={isInviteOpen} onOpenChange={onInviteOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Invite New User
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onValueChange={setInviteEmail}
                  />
                  
                  <div>
                    <p className="text-sm mb-2">Role</p>
                    <div className="flex gap-2">
                      <Button
                        variant={inviteRole === "user" ? "flat" : "light"}
                        color={inviteRole === "user" ? "primary" : "default"}
                        onPress={() => setInviteRole("user")}
                        className="flex-1"
                      >
                        Regular User
                      </Button>
                      <Button
                        variant={inviteRole === "admin" ? "flat" : "light"}
                        color={inviteRole === "admin" ? "primary" : "default"}
                        onPress={() => setInviteRole("admin")}
                        className="flex-1"
                      >
                        Administrator
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleInviteSubmit}>
                  Send Invitation
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};