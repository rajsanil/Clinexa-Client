import React, { useState, useEffect } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import {
  ListBox,
  ListBoxToolbar,
  processListBoxData,
  processListBoxDragAndDrop,
  ListBoxToolbarClickEvent,
  ListBoxDragEvent,
  ListBoxItemClickEvent,
} from "@progress/kendo-react-listbox";
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
import { Security, Save } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

interface PermissionAssignmentProps {
  roleName: string;
  onPermissionsUpdated?: () => void;
}

interface PermissionItem {
  key: string;
  label: string;
  screen: string;
  selected: boolean;
}

const SELECTED_FIELD = "selected";

const PermissionAssignment: React.FC<PermissionAssignmentProps> = ({
  roleName,
  onPermissionsUpdated,
}) => {
  const [categories, setCategories] = useState<PermissionCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<PermissionCategory | null>(null);
  const [currentRolePermissions, setCurrentRolePermissions] = useState<
    string[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // ListBox data
  const [availablePermissions, setAvailablePermissions] = useState<
    PermissionItem[]
  >([]);
  const [assignedPermissions, setAssignedPermissions] = useState<
    PermissionItem[]
  >([]);
  const [draggedItem, setDraggedItem] = useState<any>({});

  useEffect(() => {
    fetchPermissions();
    fetchRolePermissions();
  }, [roleName]);

  const fetchRolePermissions = async () => {
    try {
      const response = await apiService.get(
        `${API_SETTINGS.GET_ROLE_PERMISSIONS}${roleName}`
      );

      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          setCurrentRolePermissions(response.data);
        } else if (response.data.permissions) {
          setCurrentRolePermissions(response.data.permissions);
        } else {
          setCurrentRolePermissions(response.data);
        }
      } else {
        console.warn("Failed to fetch role permissions:", response.error);
      }
    } catch (err) {
      console.error("Error fetching role permissions:", err);
    }
  };

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get(API_SETTINGS.GET_ALL_PERMISSIONS);

      if (response.success && response.data) {
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

  const transformPermissionsToListBoxData = (
    category: PermissionCategory,
    currentPermissions: string[]
  ) => {
    const allPermissions: PermissionItem[] = [];
    const assigned: PermissionItem[] = [];
    const available: PermissionItem[] = [];

    category.screens?.forEach((screen: Screen) => {
      screen.permissions.forEach((permission: Permission) => {
        const permissionItem: PermissionItem = {
          key: permission.key,
          label: permission.label,
          screen: screen.label,
          selected: false,
        };

        allPermissions.push(permissionItem);

        if (currentPermissions.includes(permission.key)) {
          assigned.push({ ...permissionItem });
        } else {
          available.push({ ...permissionItem });
        }
      });
    });

    return { available, assigned };
  };

  const handleCategoryChange = (event: any) => {
    const category = event.target.value;
    if (category && category.name) {
      setSelectedCategory(category);

      const { available, assigned } = transformPermissionsToListBoxData(
        category,
        currentRolePermissions
      );
      setAvailablePermissions(available);
      setAssignedPermissions(assigned);
    } else {
      setSelectedCategory(null);
      setAvailablePermissions([]);
      setAssignedPermissions([]);
    }
  };

  const handleItemClick = (
    event: ListBoxItemClickEvent,
    data: string,
    connectedData: string
  ) => {
    console.log("Item clicked:", event.dataItem, "Data type:", data);

    if (data === "availablePermissions") {
      setAvailablePermissions((prev) => {
        const newData = prev.map((item) => {
          if (item.key === event.dataItem.key) {
            console.log(
              "Toggling selection for:",
              item.key,
              "from",
              item[SELECTED_FIELD],
              "to",
              !item[SELECTED_FIELD]
            );
            return { ...item, [SELECTED_FIELD]: !item[SELECTED_FIELD] };
          } else if (!event.nativeEvent.ctrlKey) {
            return { ...item, [SELECTED_FIELD]: false };
          }
          return { ...item };
        });
        console.log("New available permissions:", newData);
        return newData;
      });

      setAssignedPermissions((prev) =>
        prev.map((item) => ({ ...item, [SELECTED_FIELD]: false }))
      );
    } else {
      setAssignedPermissions((prev) => {
        const newData = prev.map((item) => {
          if (item.key === event.dataItem.key) {
            console.log(
              "Toggling selection for:",
              item.key,
              "from",
              item[SELECTED_FIELD],
              "to",
              !item[SELECTED_FIELD]
            );
            return { ...item, [SELECTED_FIELD]: !item[SELECTED_FIELD] };
          } else if (!event.nativeEvent.ctrlKey) {
            return { ...item, [SELECTED_FIELD]: false };
          }
          return { ...item };
        });
        console.log("New assigned permissions:", newData);
        return newData;
      });

      setAvailablePermissions((prev) =>
        prev.map((item) => ({ ...item, [SELECTED_FIELD]: false }))
      );
    }
  };

  const handleToolBarClick = (e: ListBoxToolbarClickEvent) => {
    let toolName: string = e.toolName || "";
    let result: any = processListBoxData(
      availablePermissions,
      assignedPermissions,
      toolName,
      SELECTED_FIELD
    );
    setAvailablePermissions(result.listBoxOneData);
    setAssignedPermissions(result.listBoxTwoData);
  };

  const handleDragStart = (e: ListBoxDragEvent) => {
    setDraggedItem(e.dataItem);
  };

  const handleDrop = (e: ListBoxDragEvent) => {
    let result: any = processListBoxDragAndDrop(
      availablePermissions,
      assignedPermissions,
      draggedItem,
      e.dataItem,
      "key"
    );
    setAvailablePermissions(result.listBoxOneData);
    setAssignedPermissions(result.listBoxTwoData);
  };

  const handleSavePermissions = async () => {
    const selectedPermissionKeys = assignedPermissions.map((p) => p.key);

    if (selectedPermissionKeys.length === 0) {
      addNotification({
        type: "warning",
        title: "Warning",
        content: "Please assign at least one permission to the role",
      });
      return;
    }

    try {
      setSaving(true);

      const requestData: AssignPermissionsRequest = {
        roleName: roleName,
        permissions: selectedPermissionKeys,
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

        // Update current role permissions with the new data
        setCurrentRolePermissions(selectedPermissionKeys);

        // Update the listbox data with new current permissions
        if (selectedCategory) {
          const { available, assigned } = transformPermissionsToListBoxData(
            selectedCategory,
            selectedPermissionKeys
          );
          setAvailablePermissions(available);
          setAssignedPermissions(assigned);
        }

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

  const CustomItemRender: React.FC<any> = (props) => {
    const { dataItem } = props;
    console.log(
      "Rendering item:",
      dataItem.key,
      "selected:",
      dataItem[SELECTED_FIELD]
    );

    return (
      <div
        className={`permission-item ${
          dataItem[SELECTED_FIELD] ? "bg-blue-100 dark:bg-blue-900/30" : ""
        }`}
      >
        <div className="permission-label font-medium text-sm">
          {dataItem.label} {dataItem[SELECTED_FIELD] ? "✓" : ""}
        </div>
        <div className="permission-details text-xs text-gray-500">
          <span className="permission-key">{dataItem.key}</span>
          <span className="permission-screen ml-2">({dataItem.screen})</span>
        </div>
      </div>
    );
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
        {/* Current Permissions Summary */}
        {currentRolePermissions.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Security className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Current Permissions for {roleName}
              </h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              This role currently has {currentRolePermissions.length}{" "}
              permission(s) assigned.
            </p>
            <div className="flex flex-wrap gap-1">
              {currentRolePermissions.slice(0, 8).map((permKey) => (
                <span
                  key={permKey}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {permKey}
                </span>
              ))}
              {currentRolePermissions.length > 8 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  +{currentRolePermissions.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

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

        {/* ListBox Permissions Management */}
        {selectedCategory && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Manage Permissions for {selectedCategory.label}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Available Permissions */}
              <div>
                <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Permissions ({availablePermissions.length})
                </h6>
                <ListBox
                  style={{ height: 400, width: "100%" }}
                  data={availablePermissions}
                  textField="label"
                  selectedField={SELECTED_FIELD}
                  onItemClick={(e: ListBoxItemClickEvent) =>
                    handleItemClick(
                      e,
                      "availablePermissions",
                      "assignedPermissions"
                    )
                  }
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  toolbar={() => {
                    return (
                      <ListBoxToolbar
                        tools={[
                          "transferTo",
                          "transferAllTo",
                          "transferFrom",
                          "transferAllFrom",
                        ]}
                        data={availablePermissions}
                        dataConnected={assignedPermissions}
                        onToolClick={handleToolBarClick}
                      />
                    );
                  }}
                />
              </div>

              {/* Assigned Permissions */}
              <div>
                <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assigned Permissions ({assignedPermissions.length})
                </h6>
                <ListBox
                  style={{ height: 400, width: "100%" }}
                  data={assignedPermissions}
                  textField="label"
                  selectedField={SELECTED_FIELD}
                  onItemClick={(e: ListBoxItemClickEvent) =>
                    handleItemClick(
                      e,
                      "assignedPermissions",
                      "availablePermissions"
                    )
                  }
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSavePermissions}
                disabled={saving}
                themeColor="primary"
                size="large"
              >
                {saving ? (
                  <>
                    <CircularProgress size={16} className="text-white mr-2" />
                    Saving Permissions...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Permission Changes
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
