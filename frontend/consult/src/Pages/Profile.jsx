import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { updateProfileApi } from "../api/userApi";

function Profile() {

  const { user, logout, updateUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);

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
    try {
      setLoading(true);

      const updatedUser = await updateProfileApi(form);

      updateUser(updatedUser);

      toast.success("Profile updated successfully ");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="container">
      <h2>My Profile</h2>

      <div style={{ marginTop: "20px" }}>

        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>
          {isEditing ? (
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          ) : (
            <p>{user?.name}</p>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <p>{user?.email}</p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Phone</label>
          {isEditing ? (
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          ) : (
            <p>{user?.phone || "Not added"}</p>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>

          {!isEditing ? (
            <button
              className="btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
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
            </>
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
  );
}

export default Profile;