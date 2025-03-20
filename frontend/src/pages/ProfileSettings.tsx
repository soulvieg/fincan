import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { Button } from "react-bootstrap";
import { MdOutlineModeEdit } from "react-icons/md";
import { Link } from "react-router-dom"; // Import Link
import "../styles/ProfileSettings.css"; // Import CSS

const ProfileSettings: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundImage = "url('/img/background1.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.height = "100vh";
    document.body.style.margin = "0";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.height = "";
      document.body.style.margin = "";
    };
  }, []);
  const { user, updateUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

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
    <div className="profile-page-wrapper">
      <div className="container profile-container profile-settings-container">
        <div className="profile-settings">
          <h2>Profile Settings</h2>

          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input
              type="text"
              name="name"
              className={`form-control ${!editing ? "read-only" : ""}`}
              value={formData.name || ""}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Surname:</label>
            <input
              type="text"
              name="surname"
              className={`form-control ${!editing ? "read-only" : ""}`}
              value={formData.surname || ""}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              className={`form-control ${!editing ? "read-only" : ""}`}
              value={formData.email || ""}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone:</label>
            <input
              type="tel"
              name="phone"
              className={`form-control ${!editing ? "read-only" : ""}`}
              value={formData.phone || ""}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address:</label>
            <textarea
              name="address"
              className={`form-control ${!editing ? "read-only" : ""}`}
              value={formData.address || ""}
              onChange={handleChange}
              readOnly={!editing}
              rows={3}
            ></textarea>
          </div>

          <div className="profile-buttons mt-4">
            {editing ? (
              <button className="btn btn-success me-2" onClick={handleSave}>
                Save Changes
              </button>
            ) : (
              <Button
                variant="warning"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <MdOutlineModeEdit size={22} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
