import React, { useState, useEffect } from 'react';
import UserTable, { User } from '../components/UserTable';
import { Modal, Button, Form } from 'react-bootstrap';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        {
            id: 1,
            email: 'john.smith@example.com',
            firstName: 'John',
            lastName: 'Smith',
            role: 'Admin',
        },
        {
            id: 2,
            email: 'mary.williams@example.com',
            firstName: 'Mary',
            lastName: 'Williams',
            role: 'Manager',
        },
        {
            id: 3,
            email: 'robert.jones@example.com',
            firstName: 'Robert',
            lastName: 'Jones',
            role: 'User',
        }
    ]);

    const [roles, setRoles] = useState<string[]>(['Admin', 'Manager', 'User', 'Viewer']);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [newRole, setNewRole] = useState('');

    // Handle edit user
    const handleEditUser = (editedUser: User) => {
        setUsers(users.map(user => user.id === editedUser.id ? editedUser : user));
    };

    // Handle delete user
    const handleDeleteUser = (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    // Handle add new user
    const handleAddUser = (newUser: Omit<User, 'id'>) => {
        const lastId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;
        setUsers([...users, { ...newUser, id: lastId + 1 }]);
    };

    // Handle add new role
    const handleAddRole = () => {
        setShowRoleModal(true);
    };

    // Handle save new role
    const handleSaveRole = () => {
        if (newRole && !roles.includes(newRole)) {
            setRoles([...roles, newRole]);
            setNewRole('');
            setShowRoleModal(false);
        }
    };

    return (
        <div>
            <UserTable
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onAddUser={handleAddUser}
                onAddRole={handleAddRole}
                roles={roles}
            />

            {/* Modal for adding new role */}
            <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Role Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                placeholder="Enter role name"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveRole}>
                        Save Role
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;