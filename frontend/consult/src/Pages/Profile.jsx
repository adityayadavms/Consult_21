import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateProfileApi } from "../api/userApi";
import { validateProfile } from "../utils/validators";
import toast from "react-hot-toast";
import OtpModal from "../components/OtpModal";
import { requestPhoneUpdateApi } from "../api/userApi";

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

  /*
  ===============================
  HANDLE INPUT
  ===============================
  */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /*
  ===============================
  HANDLE SAVE
  ===============================
  */
  const handleSave = async () => {

    const error = validateProfile(form);

    if (error) {
      toast.error(error);
      return;
    }

    /*
    ===============================
    IF PHONE CHANGED → OTP FLOW
    ===============================
    */

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

    /*
    ===============================
    NORMAL UPDATE (NO PHONE CHANGE)
    ===============================
    */

    try {

      setLoading(true);

      const updatedUser = await updateProfileApi(form);

      updateUser(updatedUser);

      toast.success("Profile updated");

    } catch {

      toast.error("Update failed");

    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className="container" style={{ display: "flex", justifyContent: "center" }}>

        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "rgba(17, 24, 39, 0.75)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.6)"
          }}
        >

          {/* TITLE */}
          <h2 style={{ marginBottom: "25px", textAlign: "center" }}>
            👤 My Profile
          </h2>

          {/* NAME */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#9ca3af", fontSize: "14px" }}>Name</label>

            {isEditing ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="auth-input"
              />
            ) : (
              <p style={{ fontSize: "16px" }}>{user?.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#9ca3af", fontSize: "14px" }}>Email</label>
            <p style={{ fontSize: "16px" }}>{user?.email}</p>
          </div>

          {/* PHONE */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#9ca3af", fontSize: "14px" }}>Phone</label>

            {isEditing ? (
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="auth-input"
              />
            ) : (
              <p style={{ fontSize: "16px" }}>
                {user?.phone || "Not added"}
              </p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px"
            }}
          >

            {!isEditing ? (
              <button
                className="btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  className="btn-ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              className="btn-ghost"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </div>
      </div>

      {/* ===============================
          OTP MODAL (OUTSIDE CARD)
      =============================== */}
      {showOtpModal && (
        <OtpModal
          onClose={() => setShowOtpModal(false)}
          onSuccess={(updatedUser) => {
            updateUser(updatedUser);
            setIsEditing(false);
          }}
        />
      )}
    </>
  );
}

export default Profile;