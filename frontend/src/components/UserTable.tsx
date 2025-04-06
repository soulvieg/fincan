import React, { useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import UserItem from './UserItem';
import NewUserRow from './NewUserRow';
import { useNavigate } from 'react-router-dom';

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: number) => void;
    onAddUser: (user: Omit<User, 'id'>) => void;
    onAddRole: () => void;
    roles: string[];
}

const UserTable: React.FC<UserTableProps> = ({
                                                 users,
                                                 onEdit,
                                                 onDelete,
                                                 onAddUser,
                                                 roles
                                             }) => {
    const navigate = useNavigate();
    const [showNewUserRow, setShowNewUserRow] = useState(false);

    const handleAddUserClick = () => {
        setShowNewUserRow(true);
    };

    const handleSaveUser = (newUser: Omit<User, 'id'>) => {
        onAddUser(newUser);
        setShowNewUserRow(false);
    };

    const handleCancelAddUser = () => {
        setShowNewUserRow(false);
    };

    return (
        <Card className="rounded-border" style={{backgroundColor: '#fff0e2'}}>
            <div className="d-flex align-items-end mb-1 mt-2 justify-content-between">
                <Card.Header as="h4" style={{borderBottom: 'none', backgroundColor: 'transparent'}}>User Management</Card.Header>
                <div>
                    <Button
                        variant="outline-success"
                        style={{ fontSize: '15px', padding: '5px 10px' }}
                        size='sm'
                        className="me-2 add-button"
                        onClick={handleAddUserClick}
                        disabled={showNewUserRow}>
                        Add New User
                    </Button>
                </div>
            </div>
            <Card.Body>
                <Table bordered hover className="custom-table" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <thead>
                    <tr className="rounded-row header-row">
                        <th className="text-center align-middle">User ID</th>
                        <th className="text-center align-middle">Email</th>
                        <th className="text-center align-middle">First Name</th>
                        <th className="text-center align-middle">Last Name</th>
                        <th className="text-center align-middle">Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <UserItem
                            key={user.id}
                            user={user}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                    {showNewUserRow && (
                        <NewUserRow
                            onSave={handleSaveUser}
                            onCancel={handleCancelAddUser}
                            roles={roles}
                        />
                    )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default UserTable;