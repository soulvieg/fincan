import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import { Button } from "react-bootstrap";
import { MdOutlineModeEdit } from "react-icons/md";
import "../styles/ProfileSettings.css";

interface CreditCard {
  cardNumber: string;
  expirationDate: string;
  cardholderName: string;
}

const ProfileSettings: React.FC = () => {
  const { user, updateUser, deleteCreditCard } = useUser();
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    creditCard: {
      cardNumber: "",
      expirationDate: "",
      cardholderName: "",
    } as CreditCard,
  });

  // Load background image
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

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        creditCard: user.creditCard ?? {
          cardNumber: "",
          expirationDate: "",
          cardholderName: "",
        },
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("creditCard.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        creditCard: {
          ...prev.creditCard,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateCreditCard = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const { creditCard } = formData;
    if (editing) {
      if (!creditCard.cardNumber || creditCard.cardNumber.length !== 16) {
        newErrors["creditCard.cardNumber"] = "Card number must be 16 digits";
      }
      if (!creditCard.expirationDate) {
        newErrors["creditCard.expirationDate"] = "Expiration date cannot be empty";
      }
      if (!creditCard.cardholderName) {
        newErrors["creditCard.cardholderName"] = "Cardholder name cannot be empty";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setServerError(null);
    setServerSuccess(null);
    if (!validateCreditCard()) return;

    try {
      const payload = {
        firstName:   formData.first_name,
        lastName:    formData.last_name,
        email:       formData.email,
        homeAddress: formData.address,
        phoneNumber: formData.phone_number,
        creditCard:  formData.creditCard,
      };
      const response = await axios.put(
        `/api/users/${user?.id}/profile`,
        payload
      );
      const updated = response.data.user;
      updateUser({
        email:       updated.email,
        phone_number: updated.phone_number || updated.phone,
        address:     updated.homeAddress || updated.address,
        creditCard:  formData.creditCard,
      });
      setServerSuccess("Profile updated successfully.");
      setEditing(false);
      setErrors({});
    } catch (err: any) {
      console.error("Update error:", err.response || err);
      setServerError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleDeleteCard = () => {
    deleteCreditCard();
    setFormData(prev => ({
      ...prev,
      creditCard: { cardNumber: "", expirationDate: "", cardholderName: "" },
    }));
  };

  return (
    <div className="profile-page-wrapper">
      <div className="container profile-settings-container">
        <div className="profile-settings">
          <h2>Profile Settings</h2>
          {serverError && <div className="alert alert-danger">{serverError}</div>}
          {serverSuccess && <div className="alert alert-success">{serverSuccess}</div>}

          {/* First/Last Name (read-only) */}
          <div className="mb-3">
            <label className="form-label">First Name:</label>
            <input
              name="first_name"
              className="form-control read-only"
              value={formData.first_name}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name:</label>
            <input
              name="last_name"
              className="form-control read-only"
              value={formData.last_name}
              readOnly
            />
          </div>

          {/* Editable fields */}
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              className={`form-control ${editing ? "" : "read-only"}`}
              value={formData.email}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone:</label>
            <input
              type="tel"
              name="phone_number"
              className={`form-control ${editing ? "" : "read-only"}`}
              value={formData.phone_number}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address:</label>
            <textarea
              name="address"
              className={`form-control ${editing ? "" : "read-only"}`}
              value={formData.address}
              onChange={handleChange}
              readOnly={!editing}
              rows={3}
            />
          </div>

          {/* Credit Card Section */}
          <div className="credit-card-section mt-4">
            <h3>Payment Information</h3>
            <div className="mb-3">
              <label className="form-label">Card Number:</label>
              <input
                type="text"
                name="creditCard.cardNumber"
                className={`form-control ${editing ? "" : "read-only"}`}
                value={formData.creditCard.cardNumber}
                onChange={handleChange}
                readOnly={!editing}
                maxLength={16}
              />
              {errors["creditCard.cardNumber"] && (
                <div className="error-message">{errors["creditCard.cardNumber"]}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Expiration Date (MM/YY):</label>
              <input
                type="text"
                name="creditCard.expirationDate"
                className={`form-control ${editing ? "" : "read-only"}`}
                value={formData.creditCard.expirationDate}
                onChange={handleChange}
                readOnly={!editing}
                maxLength={5}
              />
              {errors["creditCard.expirationDate"] && (
                <div className="error-message">{errors["creditCard.expirationDate"]}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Cardholder Name:</label>
              <input
                type="text"
                name="creditCard.cardholderName"
                className={`form-control ${editing ? "" : "read-only"}`}
                value={formData.creditCard.cardholderName}
                onChange={handleChange}
                readOnly={!editing}
              />
              {errors["creditCard.cardholderName"] && (
                <div className="error-message">{errors["creditCard.cardholderName"]}</div>
              )}
            </div>
            {!editing && formData.creditCard.cardNumber && (
              <button className="btn btn-danger mt-2" onClick={handleDeleteCard}>
                Delete Card Information
              </button>
            )}
          </div>

          <div className="profile-buttons mt-4">
            {editing ? (
              <button className="btn btn-success me-2" onClick={handleSave}>
                Save Changes
              </button>
            ) : (
              <Button variant="warning" size="sm" onClick={() => setEditing(true)}>
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