import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { Button } from "react-bootstrap";
import { MdOutlineModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import "../styles/ProfileSettings.css";

interface CreditCard {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardholderName: string;
}

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

  const { user, updateUser, deleteCreditCard } = useUser();
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    creditCard: {
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      cardholderName: "",
    } as CreditCard | undefined,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        creditCard: user.creditCard || {
          cardNumber: "",
          expirationDate: "",
          cvv: "",
          cardholderName: "",
        },
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle credit card fields
    if (name.startsWith("creditCard.")) {
      const field = name.split(".")[1];

      // Validate card number (only numbers, max 16 digits)
      if (field === "cardNumber") {
        const numericValue = value.replace(/\D/g, "").slice(0, 16);
        setFormData({
          ...formData,
          creditCard: {
            ...formData.creditCard!,
            [field]: numericValue,
          },
        });
        return;
      }

      // Validate CVV (only numbers, max 3 digits)
      if (field === "cvv") {
        const numericValue = value.replace(/\D/g, "").slice(0, 3);
        setFormData({
          ...formData,
          creditCard: {
            ...formData.creditCard!,
            [field]: numericValue,
          },
        });
        return;
      }

      // Handle expiration date (MM/YY format)
      if (field === "expirationDate") {
        let formatted = value.replace(/\D/g, "");
        if (formatted.length > 2) {
          formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}`;
        }
        setFormData({
          ...formData,
          creditCard: {
            ...formData.creditCard!,
            [field]: formatted,
          },
        });
        return;
      }

      // For cardholder name, just update normally
      setFormData({
        ...formData,
        creditCard: {
          ...formData.creditCard!,
          [field]: value,
        },
      });
      return;
    }

    // For non-credit card fields
    setFormData({ ...formData, [name]: value });
  };

  const validateCreditCard = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const card = formData.creditCard;

    if (!card) {
      newErrors["creditCard"] = "Credit card information is required";
      setErrors(newErrors);
      return false;
    }

    // Check if fields are empty
    if (!card.cardNumber) {
      newErrors["creditCard.cardNumber"] = "Card number cannot be empty";
    } else if (card.cardNumber.length !== 16) {
      newErrors["creditCard.cardNumber"] = "Card number must be 16 digits";
    }

    if (!card.expirationDate) {
      newErrors["creditCard.expirationDate"] =
        "Expiration date cannot be empty";
    } else {
      // Validate expiration date
      const [month, year] = card.expirationDate.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
      const currentMonth = currentDate.getMonth() + 1; // 1-12

      const expMonth = parseInt(month, 10);
      const expYear = parseInt(year, 10);

      if (
        isNaN(expMonth) ||
        isNaN(expYear) ||
        expMonth < 1 ||
        expMonth > 12 ||
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
      ) {
        newErrors["creditCard.expirationDate"] =
          "Card has expired or invalid date format";
      }
    }

    if (!card.cvv) {
      newErrors["creditCard.cvv"] = "CVV cannot be empty";
    } else if (card.cvv.length !== 3) {
      newErrors["creditCard.cvv"] = "CVV must be 3 digits";
    }

    if (!card.cardholderName) {
      newErrors["creditCard.cardholderName"] =
        "Cardholder name cannot be empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    // Validate credit card if it exists
    if (formData.creditCard && !validateCreditCard()) {
      return;
    }

    // Update user data
    updateUser({
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      creditCard: formData.creditCard,
    });

    setEditing(false);
    setErrors({});
  };

  const handleDeleteCard = () => {
    deleteCreditCard();
    setFormData({
      ...formData,
      creditCard: {
        cardNumber: "",
        expirationDate: "",
        cvv: "",
        cardholderName: "",
      },
    });
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
              className={`form-control read-only`}
              value={formData.name || ""}
              readOnly={true}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Surname:</label>
            <input
              type="text"
              name="surname"
              className={`form-control read-only`}
              value={formData.surname || ""}
              readOnly={true}
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

          {/* Credit Card Section */}
          <div className="credit-card-section mt-4">
            <h3>Payment Information</h3>
            <div className="mb-3">
              <label className="form-label">Card Number:</label>
              <input
                type="text"
                name="creditCard.cardNumber"
                className={`form-control ${!editing ? "read-only" : ""}`}
                value={formData.creditCard?.cardNumber || ""}
                onChange={handleChange}
                readOnly={!editing}
                placeholder="1234567890123456"
                maxLength={16}
              />
              {errors["creditCard.cardNumber"] && (
                <div className="error-message">
                  {errors["creditCard.cardNumber"]}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Expiration Date (MM/YY):</label>
              <input
                type="text"
                name="creditCard.expirationDate"
                className={`form-control ${!editing ? "read-only" : ""}`}
                value={formData.creditCard?.expirationDate || ""}
                onChange={handleChange}
                readOnly={!editing}
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors["creditCard.expirationDate"] && (
                <div className="error-message">
                  {errors["creditCard.expirationDate"]}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">CVV:</label>
              <input
                type="text"
                name="creditCard.cvv"
                className={`form-control ${!editing ? "read-only" : ""}`}
                value={formData.creditCard?.cvv || ""}
                onChange={handleChange}
                readOnly={!editing}
                placeholder="123"
                maxLength={3}
              />
              {errors["creditCard.cvv"] && (
                <div className="error-message">{errors["creditCard.cvv"]}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Cardholder Name:</label>
              <input
                type="text"
                name="creditCard.cardholderName"
                className={`form-control ${!editing ? "read-only" : ""}`}
                value={formData.creditCard?.cardholderName || ""}
                onChange={handleChange}
                readOnly={!editing}
                placeholder="John Doe"
              />
              {errors["creditCard.cardholderName"] && (
                <div className="error-message">
                  {errors["creditCard.cardholderName"]}
                </div>
              )}
            </div>
            {formData.creditCard?.cardNumber && !editing && (
              <button
                className="btn btn-danger mt-2"
                onClick={handleDeleteCard}
              >
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
