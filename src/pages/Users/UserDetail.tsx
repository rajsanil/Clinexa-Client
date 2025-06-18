import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { API_SETTINGS } from "../../utils/settings";
import { User } from "../../types/user.types";
import { apiService } from "../../utils/apiRequest";
import {
  Person,
  Email,
  Phone,
  Lock,
  LockOpen,
  CheckCircle,
  Cancel,
  ArrowBack,
  Edit,
  Save,
  Close,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Note: You'll need to create this endpoint in your API
      const response = await apiService.get<{ user: User }>(
        `${API_SETTINGS.GET_USERS}/${id}`
      );

      if (response.success && response.data) {
        setUser(response.data.user);
        setEditForm({
          userName: response.data.user.userName,
          email: response.data.user.email,
          phoneNumber: response.data.user.phoneNumber,
        });
      } else {
        setError(response.error?.join(", ") || "Failed to fetch user");
      }
    } catch (err) {
      setError("Failed to fetch user. Please try again.");
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setEditForm({
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Note: You'll need to create this endpoint in your API
      const response = await apiService.put(
        `${API_SETTINGS.GET_USERS}/${id}`,
        editForm
      );

      if (response.success) {
        // Update local user state
        if (user) {
          setUser({
            ...user,
            userName: editForm.userName,
            email: editForm.email,
            phoneNumber: editForm.phoneNumber,
          });
        }
        setIsEditing(false);
      } else {
        setError(response.error?.join(", ") || "Failed to update user");
      }
    } catch (err) {
      setError("Failed to update user. Please try again.");
      console.error("Error updating user:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="User Details | Dashboard"
          description="View and manage user details"
        />
        <div className="flex items-center justify-center min-h-96">
          <CircularProgress size={48} className="text-blue-600" />
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <PageMeta
          title="User Details | Dashboard"
          description="View and manage user details"
        />
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">
              {error || "User not found"}
            </p>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300"
            >
              Back to Users
            </button>
            <button
              onClick={fetchUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${user.userName} | User Details`}
        description="View and manage user details"
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-3 py-2 text-sm font-medium "
            >
              <ArrowBack className="w-4 h-4 mr-2" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Details
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and manage user information
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <Close className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <CircularProgress size={16} className="text-white mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* User Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center mb-4">
              <Person className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.userName}
                    onChange={(e) =>
                      handleInputChange("userName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {user.userName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {user.phoneNumber || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center mb-4">
              {user.lockoutEnd ? (
                <Lock className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
              ) : (
                <LockOpen className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
              )}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Status
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Status
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.lockoutEnd
                      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  }`}
                >
                  {user.lockoutEnd ? (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </>
                  ) : (
                    <>
                      <LockOpen className="w-3 h-3 mr-1" />
                      Active
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Verified
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.emailConfirmed
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {user.emailConfirmed ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    <>
                      <Cancel className="w-3 h-3 mr-1" />
                      Unverified
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Verified
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.phoneNumberConfirmed
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {user.phoneNumberConfirmed ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    <>
                      <Cancel className="w-3 h-3 mr-1" />
                      Unverified
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Two-Factor Auth
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.twoFactorEnabled
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  }`}
                >
                  {user.twoFactorEnabled ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <Cancel className="w-3 h-3 mr-1" />
                      Disabled
                    </>
                  )}
                </span>
              </div>
              {user.lockoutEnd && (
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lockout End
                  </span>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {new Date(user.lockoutEnd).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
