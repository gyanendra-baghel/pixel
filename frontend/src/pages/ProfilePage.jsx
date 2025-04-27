import { useState, useEffect } from "react";
import { User, Mail, Key, Save, Eye, EyeOff, Check, AlertCircle, Loader } from "lucide-react";
import axiosInstance from "../utils/api";

export default function ProfilePage() {
  // User state
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: ""
  });

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [activeSection, setActiveSection] = useState("profile"); // profile or security

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/auth/');
        setUserData(response.data);
        setFormData(prev => ({
          ...prev,
          name: response.data.name
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Profile section validation
    if (activeSection === "profile") {
      if (!formData.name.trim()) {
        errors.name = "Name is required";
      }
    }

    // Security section validation
    if (activeSection === "security") {
      if (!formData.currentPassword) {
        errors.currentPassword = "Current password is required";
      }

      if (!formData.newPassword) {
        errors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 8) {
        errors.newPassword = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your new password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset status
    setError(null);
    setUpdateSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);

      if (activeSection === "profile") {
        await axiosInstance.put('/api/user/profile', {
          name: formData.name
        });

        // Update local state
        setUserData(prev => ({
          ...prev,
          name: formData.name
        }));

        setUpdateSuccess(true);
      } else if (activeSection === "security") {
        await axiosInstance.put('/api/user/password', {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });

        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));

        setUpdateSuccess(true);
      }
    } catch (err) {
      console.error("Error updating profile:", err);

      // Handle specific error cases
      if (err.response && err.response.status === 401) {
        setFormErrors(prev => ({
          ...prev,
          currentPassword: "Current password is incorrect"
        }));
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setUpdating(false);

      // Auto-hide success message after 3 seconds
      if (updateSuccess) {
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-1">View and manage your account information</p>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader className="animate-spin mr-2" size={24} />
          <span className="text-gray-600 font-medium">Loading profile...</span>
        </div>
      ) : error && !formErrors ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center my-8">
          <AlertCircle size={24} className="mr-3 flex-shrink-0" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveSection("profile")}
              className={`px-6 py-4 text-sm font-medium flex items-center ${activeSection === "profile"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
                }`}
            >
              <User size={18} className="mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveSection("security")}
              className={`px-6 py-4 text-sm font-medium flex items-center ${activeSection === "security"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
                }`}
            >
              <Key size={18} className="mr-2" />
              Security
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success message */}
            {updateSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                <Check size={20} className="mr-2 flex-shrink-0" />
                <p>
                  {activeSection === "profile"
                    ? "Profile information updated successfully!"
                    : "Password changed successfully!"}
                </p>
              </div>
            )}

            {/* Profile information form */}
            {activeSection === "profile" && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Email field (readonly) */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={userData.email}
                        className="bg-gray-50 border border-gray-300 text-gray-500 pl-10 py-2 px-4 rounded-md block w-full focus:ring-0 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Your email address cannot be changed</p>
                  </div>

                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`border ${formErrors.name ? 'border-red-300' : 'border-gray-300'
                          } pl-10 py-2 px-4 rounded-md block w-full focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Your full name"
                      />
                    </div>
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Role (readonly) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <div className="bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 rounded-md inline-block">
                      <span className="capitalize font-medium">{userData.role}</span>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={updating}
                      className={`flex items-center justify-center w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 ${updating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {updating ? (
                        <>
                          <Loader size={18} className="animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Security form */}
            {activeSection === "security" && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={18} className="text-gray-400" />
                      </div>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={`border ${formErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                          } pl-10 pr-10 py-2 px-4 rounded-md block w-full focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {formErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={18} className="text-gray-400" />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`border ${formErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                          } pl-10 pr-10 py-2 px-4 rounded-md block w-full focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {formErrors.newPassword ? (
                      <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={18} className="text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`border ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                          } pl-10 pr-10 py-2 px-4 rounded-md block w-full focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={updating}
                      className={`flex items-center justify-center w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 ${updating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {updating ? (
                        <>
                          <Loader size={18} className="animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
