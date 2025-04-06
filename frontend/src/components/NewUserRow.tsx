import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { User } from './UserTable';

interface NewUserRowProps {
    onSave: (user: Omit<User, 'id'>) => void;
    onCancel: () => void;
    roles: string[];
}

const NewUserRow: React.FC<NewUserRowProps> = ({ onSave, onCancel, roles }) => {
    const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
        email: '',
        firstName: '',
        lastName: '',
        role: roles[0] || 'User',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setNewUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(newUser);
    };

    return (
        <tr className="rounded-row" style={{ backgroundColor: '#e8f4f8' }}>
            <td className="text-center align-middle">ID</td>
            <td className="text-center align-middle">
                <Form.Control
                    size="sm"
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', minWidth: '150px' }}
                />
            </td>
            <td className="text-center align-middle">
                <Form.Control
                    size="sm"
                    type="text"
                    name="firstName"
                    value={newUser.firstName}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', minWidth: '100px' }}
                />
            </td>
            <td className="text-center align-middle">
                <Form.Control
                    size="sm"
                    type="text"
                    name="lastName"
                    value={newUser.lastName}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', minWidth: '100px' }}
                />
            </td>
            <td className="text-center align-middle">
                <Form.Select
                    size="sm"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    style={{ width: '100%', minWidth: '120px' }}
                >
                    {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </Form.Select>
            </td>
            <td className="text-center align-middle">-</td>
            <td className="position-absolute d-flex align-items-center justify-content-center gap-2 action-buttons"
                style={{
                    right: '-100px',
                    top: '0',
                    bottom: '0',
                    height: '100%',
                    outline: '1px solid #666',
                }}>
                <Button variant="success" size="sm" onClick={handleSubmit}>
                    Save
                </Button>
                <Button variant="outline-danger" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
            </td>
        </tr>
    );
};

export default NewUserRow;