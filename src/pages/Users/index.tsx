import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { GridCellProps } from "@progress/kendo-react-grid";
import PageMeta from "../../components/common/PageMeta";
import { API_SETTINGS } from "../../utils/settings";
import { User, UsersResponse } from "../../types/user.types";
import { apiService } from "../../utils/apiRequest";
import { useActionBar } from "../../context/ActionBarContext";
import {
  CheckCircle,
  Cancel,
  Lock,
  LockOpen,
  Visibility,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import { Button } from "@progress/kendo-react-buttons";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { setConfig } = useActionBar();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Configure action bar when component mounts
  useEffect(() => {
    setConfig({
      title: "Users",
      subtitle: `Manage and view all users in the system (${users.length} total)`,
      showSearch: true,
      searchPlaceholder: "Search users by name, email...",
      onSearch: (query: string) => {
        setSearchQuery(query);
        // Here you could implement actual search filtering
      },
      actions: [
        {
          id: "refresh",
          type: "refresh",
          label: "Refresh",
          onClick: fetchUsers,
          loading: loading,
        },
        {
          id: "add-user",
          type: "add",
          label: "Add User",
          onClick: () => {
            // Navigate to add user page when it exists
            console.log("Add user functionality to be implemented");
          },
          variant: "primary",
        },
        {
          id: "export",
          type: "export",
          label: "Export",
          onClick: () => {
            // Implement export functionality
            console.log("Export users functionality to be implemented");
          },
          variant: "secondary",
        },
      ],
    });

    // Cleanup when component unmounts
    return () => {
      setConfig(null);
    };
  }, [setConfig, users.length, loading]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get<UsersResponse>(
        API_SETTINGS.GET_USERS
      );

      if (response.success && response.data) {
        setUsers(response.data.users);
      } else {
        setError(response.error?.join(", ") || "Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Custom cell renderers
  const StatusCell = (props: GridCellProps) => {
    const { dataItem, field } = props;
    const status = dataItem[field!];

    return (
      <td className={`${props.className || ""} p-3`}>
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {status ? (
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
      </td>
    );
  };

  const LockoutCell = (props: GridCellProps) => {
    const { dataItem } = props;
    const isLocked = dataItem.lockoutEnd !== null;

    return (
      <td className={`${props.className || ""} p-3`}>
        <div className="flex justify-center">
          {isLocked ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <LockOpen className="w-3 h-3 mr-1" />
              Active
            </span>
          )}
        </div>
      </td>
    );
  };

  const ActionsCell = (props: GridCellProps) => {
    const { dataItem } = props;

    const handleViewUser = () => {
      navigate(`/users/${dataItem.id}`);
    };

    return (
      <td className={`${props.className || ""} p-3 w-full`}>
        <div className="flex items-center justify-center w-full">
          <Button
            size="small"
            fillMode="flat"
            onClick={handleViewUser}
            title="View user details"
          >
            <Visibility className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
      </td>
    );
  };

  const UserAvatarCell = (props: GridCellProps) => {
    const { dataItem } = props;

    return (
      <td className={`${props.className || ""} p-3`}>
        <div className="flex items-center">
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {dataItem.userName}
            </p>
          </div>
        </div>
      </td>
    );
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="Users | Clinic ERP"
          description="Manage users in your dashboard"
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
          title="Users | Clinic ERP"
          description="Manage users in your dashboard"
        />
        <div className="text-center py-12">
          <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
          <button
            onClick={fetchUsers}
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
        title="Users | Clinic ERP"
        description="Manage users in your dashboard"
      />

      <div className="bg-gray-50 dark:bg-gray-900 h-full">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden h-full">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-gray-400 text-xl">👥</span>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No users found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                There are no users to display at the moment.
              </p>
            </div>
          ) : (
            <div className="w-full h-full users-table-container">
              <Grid
                data={users}
                className="custom-users-grid"
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
                  field="userName"
                  title="User"
                  width="200px"
                  minResizableWidth={150}
                  cells={{ data: UserAvatarCell }}
                  filterable={true}
                  sortable={true}
                  reorderable={true}
                  headerClassName="font-semibold"
                />
                <GridColumn
                  field="email"
                  title="Email Address"
                  width="240px"
                  minResizableWidth={180}
                  filterable={true}
                  sortable={true}
                  reorderable={true}
                  headerClassName="font-semibold"
                  filterTitle="Filter by email address"
                />
                <GridColumn
                  field="phoneNumber"
                  title="Phone Number"
                  width="140px"
                  minResizableWidth={120}
                  filterable={true}
                  sortable={true}
                  reorderable={true}
                  headerClassName="font-semibold"
                  filterTitle="Filter by phone number"
                />
                <GridColumn
                  field="lockoutEnd"
                  title="Account Status"
                  width="130px"
                  minResizableWidth={100}
                  cells={{ data: LockoutCell }}
                  filterable={false}
                  sortable={true}
                  reorderable={true}
                  headerClassName="font-semibold text-center"
                  className="text-center"
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
    </>
  );
};

export default Users;
