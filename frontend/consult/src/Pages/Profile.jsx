// src/Pages/Profile.jsx

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateProfileApi } from "../api/userApi";
import { validateProfile } from "../utils/validators";
import toast from "react-hot-toast";
import OtpModal from "../components/OtpModal";
import { requestPhoneUpdateApi } from "../api/userApi";
import SimpleLayout from "../layouts/SimpleLayout";
import "./profile.css"; // We'll create this

function Profile() {
  const { user, logout, updateUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    const error = validateProfile(form);
    if (error) {
      toast.error(error);
      return;
    }

    // If phone changed → OTP flow
    if (form.phone !== user.phone) {
      try {
        setLoading(true);
        await requestPhoneUpdateApi(form.phone);
        toast.success("OTP sent to your phone");
        setPendingPhone(form.phone);
        setShowOtpModal(true);
      } catch (err) {
        toast.error("Failed to send OTP");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal update (no phone change)
    try {
      setLoading(true);
      const updatedUser = await updateProfileApi(form);
      updateUser(updatedUser);
      toast.success("Profile updated");
      setIsEditing(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleLayout title="My Profile">
      <div className="profile-container">
        <div className="profile-card">
          {/* NAME */}
          <div className="profile-field">
            <label>Name</label>
            {isEditing ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="profile-input"
              />
            ) : (
              <p className="profile-value">{user?.name || "Not set"}</p>
            )}
          </div>

          {/* EMAIL (Read-only) */}
          <div className="profile-field">
            <label>Email</label>
            <p className="profile-value profile-email">{user?.email}</p>
          </div>

          {/* PHONE */}
          <div className="profile-field">
            <label>Phone</label>
            {isEditing ? (
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="profile-input"
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
            ) : (
              <p className="profile-value">
                {user?.phone || "Not added"}
              </p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="profile-btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div className="profile-btn-group">
                <button
                  className="profile-btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="profile-btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setForm({
                      name: user?.name || "",
                      phone: user?.phone || ""
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              className="profile-btn-danger"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <OtpModal
          phone={pendingPhone}
          onClose={() => {
            setShowOtpModal(false);
            setPendingPhone("");
            // Reset form phone to original
            setForm(prev => ({ ...prev, phone: user?.phone || "" }));
          }}
          onSuccess={(updatedUser) => {
            updateUser(updatedUser);
            setIsEditing(false);
            setShowOtpModal(false);
            setPendingPhone("");
          }}
        />
      )}
    </SimpleLayout>
  );
}

export default Profile;