import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { API_SETTINGS } from "../../utils/settings";
import { User } from "../../types/user.types";
import { apiService } from "../../utils/apiRequest";
import {
  Person,
  ArrowBack,
  Edit,
  Save,
  Close,
  CheckCircle,
  Cancel,
  Lock,
  LockOpen,
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

      const response = await apiService.put(
        `${API_SETTINGS.GET_USERS}/${id}`,
        editForm
      );

      if (response.success) {
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
          title="User Details | Clinic ERP"
          description="View and manage user details"
        />
        <div className="flex items-center justify-center min-h-96">
          <CircularProgress size={40} className="text-blue-600" />
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <PageMeta
          title="User Details | Clinic ERP"
          description="View and manage user details"
        />
        <div className="text-center py-12">
          <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">
              {error || "User not found"}
            </p>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Users
            </button>
            <button
              onClick={fetchUser}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/")}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ArrowBack className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <Person className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      User Details
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.userName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <Close className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <CircularProgress
                          size={16}
                          className="text-white mr-2"
                        />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                User Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.userName}
                    onChange={(e) =>
                      handleInputChange("userName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600">
                    {user.userName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address:
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600">
                    {user.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number:
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600">
                    {user.phoneNumber || "Not provided"}
                  </p>
                )}
              </div>

              {/* Status Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Account Status:
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        user.lockoutEnd
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
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

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Email Verified
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        user.emailConfirmed
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {user.emailConfirmed ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Yes
                        </>
                      ) : (
                        <>
                          <Cancel className="w-3 h-3 mr-1" />
                          No
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Phone Verified
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        user.phoneNumberConfirmed
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {user.phoneNumberConfirmed ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Yes
                        </>
                      ) : (
                        <>
                          <Cancel className="w-3 h-3 mr-1" />
                          No
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Two-Factor Auth
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        user.twoFactorEnabled
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>

                  {user.lockoutEnd && (
                    <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Lockout End
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(user.lockoutEnd).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
