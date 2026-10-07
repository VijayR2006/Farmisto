import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaLock, FaHome, FaCity, FaMapPin, FaGlobe, FaCamera, FaEdit } from "react-icons/fa";
import axios from "../../../utils/axios";

const inputBase = "w-full px-4 py-3 rounded-xl border text-sm text-dark focus:outline-none transition-colors";
const inputEnabled = "border-cream-dark bg-white focus:border-orange";
const inputDisabled = "border-cream-dark bg-cream cursor-not-allowed text-muted";

const FieldRow = ({ label, icon: Icon, name, type = "text", value, onChange, enabled, onToggle, placeholder }) => (
  <div>
    <label className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider mb-2">
      <Icon size={12} className="text-orange" /> {label}
    </label>
    <div className="flex items-center gap-2">
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={!enabled}
        placeholder={placeholder}
        className={`${inputBase} ${enabled ? inputEnabled : inputDisabled}`}
      />
      <button
        type="button"
        onClick={onToggle}
        className={`w-9 h-9 flex items-center justify-center rounded-xl border shrink-0 transition-colors ${enabled ? "bg-orange border-orange text-white" : "bg-white border-cream-dark text-muted hover:border-orange hover:text-orange"}`}
      >
        <FaEdit size={13} />
      </button>
    </div>
  </div>
);

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    userName: "",
    farmerProfilePhoto: null,
    farmerMobile: "",
    farmerAddress: "",
    farmerCity: "",
    farmerStateZip: "",
    farmerCountry: "",
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [editFields, setEditFields] = useState({
    userName: false, farmerMobile: false, farmerAddress: false,
    farmerCity: false, farmerStateZip: false, farmerCountry: false, farmerProfilePhoto: false,
  });
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const authHeaders = { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } };

  const fetchDefaultData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/farmer/settings/profile-data", authHeaders);
      const farmer = response.data.farmer || {};
      setFormData({
        userName: farmer.userName || "",
        farmerProfilePhoto: farmer.farmerProfilePhoto || null,
        farmerMobile: farmer.farmerMobile || "",
        farmerAddress: farmer.farmerAddress || "",
        farmerCity: farmer.farmerCity || "",
        farmerStateZip: farmer.farmerStateZip || "",
        farmerCountry: farmer.farmerCountry || "",
      });
      setPhotoPreview(farmer.farmerProfilePhoto);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDefaultData(); }, []);

  const handleChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })); };
  const handlePasswordChange = (e) => { const { name, value } = e.target; setPasswordData(p => ({ ...p, [name]: value })); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(p => ({ ...p, farmerProfilePhoto: file }));
      setPhotoPreview(URL.createObjectURL(file));
      setEditFields(p => ({ ...p, farmerProfilePhoto: true }));
    }
  };

  const toggleEdit = (field) => setEditFields(p => ({ ...p, [field]: !p[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const fieldsToUpdate = Object.keys(formData).filter(f => editFields[f]);
    if (fieldsToUpdate.length === 0) { setError("No fields selected for update. Click the edit icon to enable a field."); return; }

    const fd = new FormData();
    fieldsToUpdate.forEach(f => {
      if (f === "farmerProfilePhoto" && formData[f] instanceof File) fd.append("profilePhoto", formData[f]);
      else if (f !== "farmerProfilePhoto") fd.append(f, formData[f]);
    });

    try {
      const response = await axios.patch("/farmer/settings/update-profile", fd, {
        ...authHeaders,
        headers: { ...authHeaders.headers, "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setSuccess(true);
        setSuccessMsg("Profile updated!");
        setTimeout(() => setSuccess(false), 3000);
        await fetchDefaultData();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
    setEditFields({ userName: false, farmerMobile: false, farmerAddress: false, farmerCity: false, farmerStateZip: false, farmerCountry: false, farmerProfilePhoto: false });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError("Both current and new password are required");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      const response = await axios.patch("/farmer/settings/changePassword", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, authHeaders);
      if (response.status === 200) {
        setSuccess(true);
        setSuccessMsg("Password changed!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordSection(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl font-bold text-dark">Profile Settings</h2>
          <p className="text-sm text-muted mt-1">Click the edit icon next to a field to modify it</p>
        </div>
        {success && <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-xl">✓ {successMsg}</span>}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo */}
        <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-cream-dark/50">
          <div className="relative shrink-0">
            <img
              src={photoPreview || "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg"}
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cream-dark"
            />
            <label htmlFor="farmerProfilePhoto"
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-orange-hover transition-colors">
              <FaCamera size={12} className="text-white" />
            </label>
            <input id="farmerProfilePhoto" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
          <div>
            <p className="font-semibold text-dark">{formData.userName || "Your Name"}</p>
            <p className="text-sm text-muted">{formData.farmerCity || "Your City"}{formData.farmerCountry ? `, ${formData.farmerCountry}` : ""}</p>
            <p className="text-xs text-orange mt-1 font-medium">Click camera icon to change photo</p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-2xl p-6 border border-cream-dark/50 space-y-4">
          <h3 className="font-serif text-base font-bold text-dark mb-4">Personal Information</h3>
          <FieldRow label="Full Name" icon={FaUser} name="userName" value={formData.userName} onChange={handleChange} enabled={editFields.userName} onToggle={() => toggleEdit("userName")} placeholder="Your full name" />
          <FieldRow label="Mobile" icon={FaPhone} name="farmerMobile" value={formData.farmerMobile} onChange={handleChange} enabled={editFields.farmerMobile} onToggle={() => toggleEdit("farmerMobile")} placeholder="10-digit mobile" />
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-6 border border-cream-dark/50 space-y-4">
          <h3 className="font-serif text-base font-bold text-dark mb-4">Address</h3>
          <FieldRow label="Street Address" icon={FaHome} name="farmerAddress" value={formData.farmerAddress} onChange={handleChange} enabled={editFields.farmerAddress} onToggle={() => toggleEdit("farmerAddress")} placeholder="Street address" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow label="City" icon={FaCity} name="farmerCity" value={formData.farmerCity} onChange={handleChange} enabled={editFields.farmerCity} onToggle={() => toggleEdit("farmerCity")} placeholder="City name" />
            <FieldRow label="State & ZIP" icon={FaMapPin} name="farmerStateZip" value={formData.farmerStateZip} onChange={handleChange} enabled={editFields.farmerStateZip} onToggle={() => toggleEdit("farmerStateZip")} placeholder="State, ZIP" />
          </div>
          <FieldRow label="Country" icon={FaGlobe} name="farmerCountry" value={formData.farmerCountry} onChange={handleChange} enabled={editFields.farmerCountry} onToggle={() => toggleEdit("farmerCountry")} placeholder="Country" />
        </div>

        <button type="submit" className="w-full py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors shadow-md">
          Save Changes
        </button>
      </form>

      {/* Change Password Section */}
      <div className="mt-6 bg-white rounded-2xl border border-cream-dark/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-cream transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center">
              <FaLock size={14} className="text-orange" />
            </div>
            <span className="font-semibold text-dark text-sm">Change Password</span>
          </div>
          <span className="text-xs text-muted">{showPasswordSection ? "▲" : "▼"}</span>
        </button>

        {showPasswordSection && (
          <form onSubmit={handlePasswordSubmit} className="border-t border-cream-dark px-6 py-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Current Password</label>
              <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-sm text-dark focus:outline-none focus:border-orange" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">New Password</label>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange}
                placeholder="Enter new password (min 6 characters)"
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-sm text-dark focus:outline-none focus:border-orange" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-sm text-dark focus:outline-none focus:border-orange" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-dark text-white font-semibold rounded-xl hover:bg-dark/80 transition-colors">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
