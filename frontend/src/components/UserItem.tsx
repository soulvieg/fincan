import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { User } from './UserTable';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
      className="rounded-row"
      style={{ 
        backgroundColor: '#f9f9f9',
        transition: 'all 0.5s ease',
        transform: isHovering ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovering ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
        zIndex: isHovering ? 1 : 'auto'
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
          <div className="d-flex align-items-center justify-content-center">
            <Form.Select
              autoFocus={true}
              value={tempRole}
              onChange={(e) => setTempRole(e.target.value)}
              size="sm"
              style={{ width: '120px', fontSize: '14px', height: '31px' }}
            >
              <option value="Admin">Admin</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Customer">Customer</option>
            </Form.Select>
            <div className="ms-2 d-flex">
              <Button 
                variant="outline-success" 
                size="sm" 
                onClick={handleSaveRole} 
                style={{ width: '40px', marginRight: '5px' }}
              >
                <FaCheck size={14} />
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={handleCancelEdit}
                style={{ width: '40px' }}
              >
                <FaTimes size={14} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="position-relative">
            <span>{user.role}</span>
            {isHovering && !isEditingRole && (
              <div className={`action-buttons ${isHovering ? 'visible' : 'invisible'}`}
                style={{
                  position: 'absolute',
                  left: '95%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#f9f9f9',
                  padding: '0.25rem',
                  height: '42px',
                  border: '1.4px solid #000',
                  borderLeft: 'none',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Button 
                  variant="outline-warning" 
                  size="sm" 
                  onClick={() => setIsEditingRole(true)}
                >
                  <MdOutlineModeEdit size={16}/>
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => onDelete(user.id)}
                >
                  <IoTrashOutline size={16}/>
                </Button>
              </div>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

export default UserItem;