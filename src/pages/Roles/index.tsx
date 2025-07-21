import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { GridCellProps } from "@progress/kendo-react-grid";
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
import { useActionBar } from "../../context/ActionBarContext";
import { Visibility } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import { Role, RolesResponse } from "../../types/role.types";

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { setConfig } = useActionBar();

  useEffect(() => {
    fetchRoles();
  }, []);

  // Configure action bar when component mounts
  useEffect(() => {
    setConfig({
      title: "Roles",
      subtitle: `Manage and configure user roles (${roles.length} total)`,
      showSearch: true,
      searchPlaceholder: "Search roles...",
      onSearch: (query: string) => {
        setSearchQuery(query);
        // Here you could implement actual search filtering
      },
      actions: [
        {
          id: "refresh",
          type: "refresh",
          label: "Refresh",
          onClick: fetchRoles,
          loading: loading,
        },
        {
          id: "add-role",
          type: "add",
          label: "Add Role",
          onClick: () => setShowCreateDialog(true),
          variant: "primary",
        },
        {
          id: "export",
          type: "export",
          label: "Export",
          onClick: () => {
            // Implement export functionality
            console.log("Export roles functionality to be implemented");
          },
          variant: "secondary",
        },
      ],
    });

    // Cleanup when component unmounts
    return () => {
      setConfig(null);
    };
  }, [setConfig, roles.length, loading]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get<RolesResponse>(
        `${API_SETTINGS.GET_ROLES}`
      );

      if (response.success && response.data) {
        setRoles(response.data.roles);
      } else {
        setError(response.error?.join(", ") || "Failed to fetch roles");
      }
    } catch (err) {
      setError("Failed to fetch roles. Please try again.");
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      setCreateError("Role name is required");
      return;
    }

    try {
      setCreateLoading(true);
      setCreateError(null);

      const response = await apiService.post(API_SETTINGS.CREATE_ROLE, {
        name: roleName.trim(),
      });

      if (response.success) {
        // Reset form
        setRoleName("");
        setShowCreateDialog(false);

        // Refresh the roles list
        await fetchRoles();

        // Show success notification
        addNotification({
          type: "success",
          title: "Success",
          content: "Role created successfully",
        });
      } else {
        setCreateError(response.error?.join(", ") || "Failed to create role");
      }
    } catch (err) {
      setCreateError("Failed to create role. Please try again.");
      console.error("Error creating role:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDialogClose = () => {
    setRoleName("");
    setCreateError(null);
    setShowCreateDialog(false);
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

  // Custom cell renderers
  const RoleNameCell = (props: GridCellProps) => {
    const { dataItem } = props;

    return (
      <td className={`${props.className || ""} p-3`}>
        <div className="flex items-center">
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {dataItem.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {dataItem.normalizedName}
            </p>
          </div>
        </div>
      </td>
    );
  };

  const ActionsCell = (props: GridCellProps) => {
    const { dataItem } = props;

    const handleViewRole = () => {
      navigate(`/roles/${dataItem.id}`);
    };

    return (
      <td className={`${props.className || ""} p-3 w-full`}>
        <div className="flex items-center justify-center w-full">
          <Button
            size="small"
            fillMode="flat"
            onClick={handleViewRole}
            title="View role details"
          >
            <Visibility className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
      </td>
    );
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="Roles | Clinic ERP"
          description="Manage roles in your dashboard"
        />
        <div className="flex items-center justify-center min-h-96">
          <CircularProgress size={40} className="text-blue-600" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta
          title="Roles | Clinic ERP"
          description="Manage roles in your dashboard"
        />
        <div className="text-center py-12">
          <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
          <button
            onClick={fetchRoles}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Roles | Clinic ERP"
        description="Manage roles in your dashboard"
      />

      <div className="bg-gray-50 dark:bg-gray-900 h-full">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden h-full">
          {roles.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-gray-400 text-xl">🔐</span>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No roles found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                There are no roles to display at the moment.
              </p>
            </div>
          ) : (
            <div className="w-full h-full roles-table-container">
              <Grid
                data={roles}
                className="custom-roles-grid"
                pageable={{
                  buttonCount: 5,
                  info: true,
                  type: "numeric",
                  pageSizes: [10, 20, 50],
                  previousNext: true,
                }}
                sortable={true}
                filterable={true}
                resizable={true}
                reorderable={true}
                style={{
                  height: "100%",
                }}
              >
                <GridColumn
                  field="name"
                  title="Role"
                  width="300px"
                  minResizableWidth={200}
                  cells={{ data: RoleNameCell }}
                  filterable={true}
                  sortable={true}
                  reorderable={true}
                  headerClassName="font-semibold"
                />
                <GridColumn
                  field="id"
                  title="Role ID"
                  width="300px"
                  minResizableWidth={200}
                  filterable={true}
                  sortable={true}
                  reorderable={true}
                  headerClassName="font-semibold"
                  filterTitle="Filter by role ID"
                />
                <GridColumn
                  field="normalizedName"
                  title="Normalized Name"
                  width="200px"
                  minResizableWidth={150}
                  filterable={true}
                  sortable={true}
                  reorderable={true}
                  headerClassName="font-semibold"
                  filterTitle="Filter by normalized name"
                />
                <GridColumn
                  title="Actions"
                  width="100px"
                  minResizableWidth={80}
                  cells={{ data: ActionsCell }}
                  filterable={false}
                  sortable={false}
                  reorderable={false}
                  headerClassName="font-semibold text-center"
                  className="text-center"
                />
              </Grid>
            </div>
          )}
        </div>
      </div>

      {/* Create Role Dialog */}
      {showCreateDialog && (
        <Dialog
          title="Create New Role"
          onClose={handleDialogClose}
          width={400}
          height={280}
        >
          <div className="p-4">
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Enter a name for the new role
            </p>

            {createError && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {createError}
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role Name
              </label>
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.value ?? "")}
                placeholder="Enter role name (e.g., Receptionist)"
                disabled={createLoading}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <DialogActionsBar>
            <Button onClick={handleDialogClose} disabled={createLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateRole}
              disabled={createLoading || !roleName.trim()}
            >
              {createLoading ? "Creating..." : "Create Role"}
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

export default Roles;
