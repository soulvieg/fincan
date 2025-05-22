// src/pages/ProfileSettings.tsx
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

const MASKED_REGEX = /^(\*{4}\s){3}\d{4}$/;

const ProfileSettings: React.FC = () => {
  const { user, updateUser, deleteCreditCard } = useUser();

  /* ───────── local session-persisted tax ID ───────── */
  const [taxId, setTaxId] = useState<string>(() => {
    // initialise from sessionStorage the first time component mounts
    return sessionStorage.getItem("taxId") ?? "";
  });
  const handleTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTaxId(val);
    sessionStorage.setItem("taxId", val); // persist for this browser tab
  };

  /* ───────── rest of component state ───────── */
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

  /* ───────── background styling (unchanged) ───────── */
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

  /* ───────── populate form from user context ───────── */
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

  /* ───────── generic change handler for formData ───────── */
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

  /* ───────── credit-card validation (unchanged) ───────── */
  function validateCreditCard(): boolean {
    const newErrors: { [key: string]: string } = {};
    const cc = formData.creditCard.cardNumber.trim();
    if (editing) {
      if (cc) {
        const isMasked = MASKED_REGEX.test(cc);
        if (!isMasked && !/^\d{16}$/.test(cc)) {
          newErrors["creditCard.cardNumber"] =
            "Enter 16 digits or leave as **** **** **** 1234";
        }
      }
      if (!formData.creditCard.expirationDate) {
        newErrors["creditCard.expirationDate"] = "Expiration date cannot be empty";
      }
      if (!formData.creditCard.cardholderName) {
        newErrors["creditCard.cardholderName"] = "Cardholder name cannot be empty";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /* ───────── save profile to backend (unchanged) ───────── */
  const handleSave = async () => {
    setServerError(null);
    setServerSuccess(null);
    if (!validateCreditCard()) return;

    try {
      const payload: any = {
        firstName:   formData.first_name,
        lastName:    formData.last_name,
        email:       formData.email,
        homeAddress: formData.address,
        phoneNumber: formData.phone_number,
        // taxId is NOT sent – it’s purely client-side
      };

      const ccnum = formData.creditCard.cardNumber.trim();
      const isMasked = MASKED_REGEX.test(ccnum);
      if (editing && ccnum && !isMasked) {
        payload.creditCard = formData.creditCard;
      }

      const response = await axios.put(
        `/api/users/${user?.id}/profile`,
        payload
      );
      const updated = response.data.user;

      updateUser({
        email:        updated.email,
        phone_number: updated.phoneNumber || updated.phone,
        address:      updated.homeAddress || updated.address,
        creditCard:   payload.creditCard ? formData.creditCard : user?.creditCard,
      });

      setServerSuccess("Profile updated successfully.");
      setEditing(false);
      setErrors({});
      window.location.reload();
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

  /* ───────── render ───────── */
  return (
    <div className="profile-page-wrapper">
      <div className="container profile-settings-container">
        <div className="profile-settings">
          <h2>Profile Settings</h2>

          {serverError   && <div className="alert alert-danger">{serverError}</div>}
          {serverSuccess && <div className="alert alert-success">{serverSuccess}</div>}

          {/* basic info */}
          <div className="mb-3">
            <label className="form-label">First Name:</label>
            <input name="first_name" className="form-control read-only" value={formData.first_name} readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name:</label>
            <input name="last_name" className="form-control read-only" value={formData.last_name} readOnly />
          </div>
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

          {/* NEW Tax ID field */}
          <div className="mb-4">
            <label className="form-label">Tax&nbsp;ID :</label>
            <input
              type="text"
              name="taxId"
              className={`form-control ${editing ? "" : "read-only"}`}
              value={taxId}
              onChange={handleTaxIdChange}
              readOnly={!editing}
              maxLength={20}
            />
          </div>

          {/* credit card section (unchanged) */}
          <div className="credit-card-section mt-4">
            <h3>Payment Information</h3>
            {/* card number */}
            <div className="mb-3">
              <label className="form-label">Card Number:</label>
              <input
                type="text"
                name="creditCard.cardNumber"
                className={`form-control ${editing ? "" : "read-only"}`}
                value={formData.creditCard.cardNumber}
                onChange={handleChange}
                readOnly={!editing}
                maxLength={19}
              />
              {errors["creditCard.cardNumber"] && (
                <div className="error-message">{errors["creditCard.cardNumber"]}</div>
              )}
            </div>
            {/* expiration */}
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
            {/* cardholder */}
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

          {/* buttons */}
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