import React, { useEffect } from "react";
import "../styles/ProfileSettings.css";

const ProfileSettings: React.FC = () => {
  useEffect(() => {
    // Apply background to body
    document.body.style.backgroundImage = "url('/img/background1.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.height = "100vh";
    document.body.style.margin = "0"; // Prevents any default margin

    // Cleanup when the component unmounts
    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.height = "";
      document.body.style.margin = "";
    };
  }, []);

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      <label>Name:</label>
      <input type="text" value="John" readOnly />

      <label>Surname:</label>
      <input type="text" value="Doe" readOnly />

      <label>Email:</label>
      <input type="email" value="john.doe@example.com" readOnly />

      <label>Phone:</label>
      <input type="tel" value="+1234567890" readOnly />

      <label>Address:</label>
      <textarea value="123 Street, City" readOnly></textarea>

      <button>Log Out</button>
    </div>
  );
};

export default ProfileSettings;
