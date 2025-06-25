import React, { useState, useEffect } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { apiService } from "../../utils/apiRequest";
import { API_SETTINGS } from "../../utils/settings";
import {
  PermissionCategory,
  Screen,
  Permission,
  AssignPermissionsRequest,
} from "../../types/permissions.type";
import {
  Security,
  CheckCircle,
  RadioButtonUnchecked,
  Save,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

interface PermissionAssignmentProps {
  roleName: string;
  onPermissionsUpdated?: () => void;
}

const PermissionAssignment: React.FC<PermissionAssignmentProps> = ({
  roleName,
  onPermissionsUpdated,
}) => {
  const [categories, setCategories] = useState<PermissionCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<PermissionCategory | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get(API_SETTINGS.GET_ALL_PERMISSIONS);

      if (response.success && response.data) {
        // Handle the response structure based on your API
        // If the API returns the array directly
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data.categories) {
          setCategories(response.data.categories);
        } else {
          setCategories(response.data);
        }
      } else {
        setError(response.error?.join(", ") || "Failed to fetch permissions");
      }
    } catch (err) {
      setError("Failed to fetch permissions. Please try again.");
      console.error("Error fetching permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event: any) => {
    const category = event.target.value;
    // Don't set category if it's the default item (empty name)
    if (category && category.name) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
    setSelectedPermissions([]);
  };

  const handlePermissionToggle = (permissionKey: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionKey)) {
        return prev.filter((key) => key !== permissionKey);
      } else {
        return [...prev, permissionKey];
      }
    });
  };

  const handleSelectAll = () => {
    if (!selectedCategory || !selectedCategory.screens) return;

    // Get all permissions from all screens in the category
    const allPermissions = selectedCategory.screens.flatMap((screen) =>
      screen.permissions.map((p: Permission) => p.key)
    );

    const allSelected = allPermissions.every((key) =>
      selectedPermissions.includes(key)
    );

    if (allSelected) {
      // Deselect all
      setSelectedPermissions((prev) =>
        prev.filter((key) => !allPermissions.includes(key))
      );
    } else {
      // Select all
      setSelectedPermissions((prev) => [
        ...prev.filter((key) => !allPermissions.includes(key)),
        ...allPermissions,
      ]);
    }
  };

  const handleSavePermissions = async () => {
    if (selectedPermissions.length === 0) {
      addNotification({
        type: "warning",
        title: "Warning",
        content: "Please select at least one permission to assign",
      });
      return;
    }

    try {
      setSaving(true);

      const requestData: AssignPermissionsRequest = {
        roleName: roleName,
        permissions: selectedPermissions,
      };

      const response = await apiService.post(
        API_SETTINGS.ASSIGN_ROLE_PERMISSIONS,
        requestData
      );

      if (response.success) {
        addNotification({
          type: "success",
          title: "Success",
          content: "Permissions assigned successfully",
        });

        // Reset selections
        setSelectedPermissions([]);
        setSelectedCategory(null);

        // Notify parent component
        if (onPermissionsUpdated) {
          onPermissionsUpdated();
        }
      } else {
        setError(response.error?.join(", ") || "Failed to assign permissions");
      }
    } catch (err) {
      setError("Failed to assign permissions. Please try again.");
      console.error("Error assigning permissions:", err);
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <CircularProgress size={32} className="text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <Button
          onClick={fetchPermissions}
          size="small"
          className="mt-2"
          themeColor="primary"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center mb-6">
        <Security className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Assign Permissions
        </h2>
      </div>

      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Category
          </label>
          <DropDownList
            data={categories}
            textField="label"
            dataItemKey="name"
            value={selectedCategory}
            onChange={handleCategoryChange}
            defaultItem={{ name: "", label: "Choose a category..." }}
            style={{ width: "100%" }}
          />
        </div>

        {/* Permissions Selection */}
        {selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Available Permissions for {selectedCategory.label}
              </label>
              <Button onClick={handleSelectAll} size="small" fillMode="outline">
                {selectedCategory.screens &&
                selectedCategory.screens
                  .flatMap((screen) =>
                    screen.permissions.map((p: Permission) => p.key)
                  )
                  .every((key) => selectedPermissions.includes(key))
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {selectedCategory.screens &&
                selectedCategory.screens.map((screen: Screen) => (
                  <div key={screen.name} className="space-y-3">
                    {/* Screen Subheading */}
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                      <Security className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                        {screen.label}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({screen.permissions.length} permissions)
                      </span>
                    </div>

                    {/* Permissions for this screen */}
                    <div className="space-y-2 ml-6">
                      {screen.permissions.map((permission: Permission) => {
                        const isSelected = selectedPermissions.includes(
                          permission.key
                        );
                        return (
                          <div
                            key={permission.key}
                            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                            onClick={() =>
                              handlePermissionToggle(permission.key)
                            }
                          >
                            {isSelected ? (
                              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <RadioButtonUnchecked className="w-4 h-4 text-gray-400" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {permission.label}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {permission.key}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>

            {selectedPermissions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedPermissions.length} permission(s) selected from{" "}
                  {selectedCategory.label}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedPermissions.slice(0, 5).map((permKey) => {
                    // Find the permission label
                    const permission = selectedCategory.screens
                      .flatMap((s) => s.permissions)
                      .find((p) => p.key === permKey);
                    return (
                      <span
                        key={permKey}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {permission?.label || permKey}
                      </span>
                    );
                  })}
                  {selectedPermissions.length > 5 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      +{selectedPermissions.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSavePermissions}
                disabled={saving || selectedPermissions.length === 0}
                themeColor="primary"
              >
                {saving ? (
                  <>
                    <CircularProgress size={16} className="text-white mr-2" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Assign Permissions
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default PermissionAssignment;
