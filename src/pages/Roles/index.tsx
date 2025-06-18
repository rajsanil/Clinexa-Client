import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { GridCellProps } from "@progress/kendo-react-grid";
import PageMeta from "../../components/common/PageMeta";
import { API_SETTINGS } from "../../utils/settings";
import { apiService } from "../../utils/apiRequest";
import {
  AdminPanelSettings,
  Visibility,
  Refresh,
  Security,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import { Role, RolesResponse } from "../../types/role.types";

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

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

  // Custom cell renderers
  const RoleNameCell = (props: GridCellProps) => {
    const { dataItem } = props;

    return (
      <td className={`${props.className || ""} p-3`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
              <Security className="w-5 h-5 text-white" />
            </div>
          </div>
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
          <button
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            onClick={handleViewRole}
            title="View role details"
          >
            <Visibility className="w-3 h-3 mr-1" />
            View
          </button>
        </div>
      </td>
    );
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="Roles | Dashboard"
          description="Manage roles in your dashboard"
        />
        <div className="flex items-center justify-center min-h-96">
          <CircularProgress size={48} className="text-blue-600" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta
          title="Roles | Dashboard"
          description="Manage roles in your dashboard"
        />
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
          <button
            onClick={fetchRoles}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
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
        title="Roles | Dashboard"
        description="Manage roles in your dashboard"
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Roles
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and view all roles in the system
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={fetchRoles}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Refresh className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Roles Count */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <AdminPanelSettings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Roles
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {roles.length}
              </div>
            </div>
          </div>
        </div>

        {/* Kendo Grid */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {roles.length === 0 ? (
            <div className="text-center py-12">
              <AdminPanelSettings className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No roles found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                There are no roles to display at the moment.
              </p>
            </div>
          ) : (
            <div className="w-full roles-table-container">
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
                  height: "600px",
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
    </>
  );
};

export default Roles;
