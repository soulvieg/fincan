import React, { useState } from "react";
import { useUser } from "../components/UserContext";
import "../styles/ProfileSettings.css";

const ProfileSettings: React.FC = () => {
  const { user, updateUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    updateUser(formData);
    setEditing(false);
  };

  return (
    <>
      <header className="second-header">
        <h1 className="title2">
          <span className="emoji2">☕</span>Fincan
        </h1>
      </header>

      <div className="profile-settings">
        <h2>Profile Settings</h2>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          readOnly={!editing}
        />

        <label>Surname:</label>
        <input
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          readOnly={!editing}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          readOnly={!editing}
        />

        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          readOnly={!editing}
        />

        <label>Address:</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          readOnly={!editing}
        ></textarea>

        {editing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}

        <button>Log Out</button>
      </div>
    </>
  );
};

export default ProfileSettings;
