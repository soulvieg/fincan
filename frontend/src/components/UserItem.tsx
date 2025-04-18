import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { User } from './UserTable';

interface UserItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
  onEdit,
  onDelete
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [tempRole, setTempRole] = useState(user.role);

  const handleSaveRole = () => {
    onEdit({ ...user, role: tempRole });
    setIsEditingRole(false);
  };

  const handleCancelEdit = () => {
    setTempRole(user.role);
    setIsEditingRole(false);
  };

  return (
    <tr
      className={`rounded-row position-relative ${isHovering ? 'hover-active' : ''}`}
      style={{ 
        backgroundColor: isHovering ? '#f0f0f0' : '#f9f9f9',
        position: 'relative' // Ensure the tr has relative positioning
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <td className="text-center align-middle">{user.id}</td>
      <td className="text-center align-middle">{user.email}</td>
      <td className="text-center align-middle">{user.firstName}</td>
      <td className="text-center align-middle">{user.lastName}</td>
      <td className="text-center align-middle">
        {isEditingRole ? (
          <div className="d-flex align-items-center">
            <Form.Select
              autoFocus={true}
              value={tempRole}
              onChange={(e) => setTempRole(e.target.value)}
              size="sm"
              style={{ width: '120px', fontSize: '14px' }}
            >
              <option value="Admin">Admin</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Customer">Customer</option>
            </Form.Select>
            <div className="ms-2 d-flex flex-column">
              <Button variant="success" size="sm" onClick={handleSaveRole} style={{ width: '65px', marginBottom: '5px' }}>
                Save
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleCancelEdit} style={{ width: '65px' }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          user.role
        )}
      </td>
      {isHovering && !isEditingRole && (
        <td 
          className="action-buttons-cell" 
          style={{ 
            position: 'absolute',
            right: '-100px',
            top: '0',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            background: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '0 4px 4px 0',
            padding: '0 8px',
            zIndex: 10,
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
          }}
        >
          <Button variant="outline-warning" size="sm" onClick={() => setIsEditingRole(true)}>
            <MdOutlineModeEdit size={22}/>
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => onDelete(user.id)}>
            <IoTrashOutline size={22}/>
          </Button>
        </td>
      )}
    </tr>
  );
};

export default UserItem;