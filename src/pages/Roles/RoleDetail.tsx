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
import PermissionAssignment from "../../components/permissions/PermissionAssignment";

const RoleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

      const response = await apiService.put(`${API_SETTINGS.GET_ROLES}/${id}`, {
        name: editForm.name.trim(),
      });

      if (response.success) {
        if (role) {
          setRole({
            ...role,
            name: editForm.name.trim(),
            normalizedName: editForm.name.trim().toUpperCase(),
          });
        }
        setIsEditing(false);

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

      const response = await apiService.delete(
        `${API_SETTINGS.GET_ROLES}/${id}`
      );

      if (response.success) {
        addNotification({
          type: "success",
          title: "Success",
          content: "Role deleted successfully",
        });

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

  const handlePermissionsUpdated = () => {
    addNotification({
      type: "success",
      title: "Success",
      content: "Role permissions updated successfully",
    });
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="Role Details | Clinic ERP"
          description="View and manage role details"
        />
        <div className="flex items-center justify-center min-h-96">
          <CircularProgress size={40} className="text-blue-600" />
        </div>
      </>
    );
  }

  if (error || !role) {
    return (
      <>
        <PageMeta
          title="Role Details | Clinic ERP"
          description="View and manage role details"
        />
        <div className="text-center py-12">
          <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">
              {error || "Role not found"}
            </p>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => navigate("/roles")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Roles
            </button>
            <button
              onClick={fetchRole}
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
        title={`${role.name} | Role Details`}
        description="View and manage role details"
      />

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/roles")}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ArrowBack className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <AdminPanelSettings className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Role Details
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {role.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      disabled={deleting}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={deleting}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <Delete className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                      <Close className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || !editForm.name.trim()}
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
          {/* Error Display */}
          {editError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                {editError}
              </p>
            </div>
          )}

          {/* Role Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Role Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Role Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role Name:
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
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600">
                    {role.name}
                  </p>
                )}
              </div>

              {/* Normalized Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Normalized Name:
                </label>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600">
                  {isEditing
                    ? editForm.name.toUpperCase()
                    : role.normalizedName}
                </p>
              </div>

              {/* Role ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role ID:
                </label>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600 font-mono break-all">
                  {role.id}
                </p>
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <PermissionAssignment
            roleName={role.name}
            onPermissionsUpdated={handlePermissionsUpdated}
          />
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
