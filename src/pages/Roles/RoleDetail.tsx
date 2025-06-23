import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import PageMeta from "../../components/common/PageMeta";
import { API_SETTINGS } from "../../utils/settings";
import { apiService } from "../../utils/apiRequest";
import {
  AdminPanelSettings,
  ArrowBack,
  Edit,
  Delete,
  Save,
  Close,
  Warning,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { Role } from "../../types/role.types";

const RoleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchRole();
    }
  }, [id]);

  const fetchRole = async () => {
    try {
      setLoading(true);
      setError(null);

      // Note: You'll need to create this endpoint in your API
      const response = await apiService.get<{ role: Role }>(
        `${API_SETTINGS.GET_ROLES}/${id}`
      );

      if (response.success && response.data) {
        setRole(response.data.role);
        setEditForm({
          name: response.data.role.name,
        });
      } else {
        setError(response.error?.join(", ") || "Failed to fetch role");
      }
    } catch (err) {
      setError("Failed to fetch role. Please try again.");
      console.error("Error fetching role:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditError(null);
  };

  const handleCancel = () => {
    if (role) {
      setEditForm({
        name: role.name,
      });
    }
    setIsEditing(false);
    setEditError(null);
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      setEditError("Role name is required");
      return;
    }

    try {
      setSaving(true);
      setEditError(null);

      // Note: You'll need to create this endpoint in your API
      const response = await apiService.put(`${API_SETTINGS.GET_ROLES}/${id}`, {
        name: editForm.name.trim(),
      });

      if (response.success) {
        // Update local role state
        if (role) {
          setRole({
            ...role,
            name: editForm.name.trim(),
            normalizedName: editForm.name.trim().toUpperCase(),
          });
        }
        setIsEditing(false);

        // Show success notification
        addNotification({
          type: "success",
          title: "Success",
          content: "Role updated successfully",
        });
      } else {
        setEditError(response.error?.join(", ") || "Failed to update role");
      }
    } catch (err) {
      setEditError("Failed to update role. Please try again.");
      console.error("Error updating role:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      // Note: You'll need to create this endpoint in your API
      const response = await apiService.delete(
        `${API_SETTINGS.GET_ROLES}/${id}`
      );

      if (response.success) {
        // Show success notification
        addNotification({
          type: "success",
          title: "Success",
          content: "Role deleted successfully",
        });

        // Navigate back to roles list after a short delay
        setTimeout(() => {
          navigate("/roles", { replace: true });
        }, 1500);
      } else {
        setError(response.error?.join(", ") || "Failed to delete role");
        setShowDeleteDialog(false);
      }
    } catch (err) {
      setError("Failed to delete role. Please try again.");
      console.error("Error deleting role:", err);
      setShowDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  const addNotification = (notification: any) => {
    const newNotification = {
      ...notification,
      id: Math.random(),
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleInputChange = (value: string) => {
    setEditForm({ name: value });
    setEditError(null);
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="Role Details | Dashboard"
          description="View and manage role details"
        />
        <div className="flex items-center justify-center min-h-96">
          <CircularProgress size={48} className="text-blue-600" />
        </div>
      </>
    );
  }

  if (error || !role) {
    return (
      <>
        <PageMeta
          title="Role Details | Dashboard"
          description="View and manage role details"
        />
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">
              {error || "Role not found"}
            </p>
          </div>
          <div className="space-x-3">
            <Button onClick={() => navigate("/roles")}>Back to Roles</Button>
            <Button themeColor="primary" onClick={fetchRole}>
              Try Again
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${role.name} | Role Details`}
        description="View and manage role details"
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/roles")}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowBack className="w-4 h-4 mr-2" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Role Details
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and manage role information
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {!isEditing ? (
              <>
                <Button
                  onClick={handleEdit}
                  themeColor="primary"
                  disabled={deleting}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Role
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  fillMode="outline"
                  disabled={deleting}
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Delete className="w-4 h-4 mr-2" />
                  Delete Role
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  fillMode="outline"
                  disabled={saving}
                >
                  <Close className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  themeColor="primary"
                  disabled={saving || !editForm.name.trim()}
                >
                  {saving ? (
                    <>
                      <CircularProgress size={16} className="text-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Error Display */}
        {editError && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">
              {editError}
            </p>
          </div>
        )}

        {/* Role Information Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center mb-4">
              <AdminPanelSettings className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Role Information
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role Name
                </label>
                {isEditing ? (
                  <Input
                    value={editForm.name}
                    onChange={(e) => handleInputChange(e.value ?? "")}
                    placeholder="Enter role name"
                    disabled={saving}
                    style={{ width: "100%" }}
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">
                    {role.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Normalized Name
                </label>
                <p className="text-gray-600 dark:text-gray-400">
                  {isEditing
                    ? editForm.name.toUpperCase()
                    : role.normalizedName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role ID
                </label>
                <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                  {role.id}
                </p>
              </div>
              {role.concurrencyStamp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Concurrency Stamp
                  </label>
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-xs break-all">
                    {role.concurrencyStamp}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center mb-4">
              <AdminPanelSettings className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Role Statistics
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Created
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {/* You can add creation date here if available in your API */}
                  System Role
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Users Assigned
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {/* You can fetch user count with this role */}-
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <Dialog
          title="Confirm Deletion"
          onClose={() => setShowDeleteDialog(false)}
          width={400}
          height={220}
        >
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <Warning className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  Are you sure you want to delete this role?
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone. The role "{role.name}" will be
                  permanently removed from the system.
                </p>
              </div>
            </div>
          </div>

          <DialogActionsBar>
            <Button
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete Role"}
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Notifications */}
      <NotificationGroup
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            closable={true}
            onClose={() => removeNotification(notification.id)}
            style={{ marginBottom: "10px" }}
          >
            <div>
              <div className="font-medium">{notification.title}</div>
              <div className="text-sm">{notification.content}</div>
            </div>
          </Notification>
        ))}
      </NotificationGroup>
    </>
  );
};

export default RoleDetail;
