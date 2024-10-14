"use client";

import { useEffect, useState, useMemo } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TablePagination from "@mui/material/TablePagination";

// Third-party Imports
import classnames from "classnames";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";

// Component Imports
import AddRoleDrawer from "./AddRoleDrawer";
import CustomTextField from "@core/components/mui/TextField";
import DialogsAlert from "@/components/dialogs/alert-dialog";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import { ThemeColor } from "@/@core/types";
import { TextFieldProps } from "@mui/material";
import TablePaginationComponent from "@/components/TablePaginationComponent";

// Define interfaces
interface IPermission {
  moduleId: number;
  moduleName: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface UsersType {
  id: number;
  role: string;
  status: string;
  modules: IPermission[];
}

type UsersTypeWithAction = UsersType & {
  action?: string;
};

type UserStatusType = {
  [key: string]: ThemeColor;
};

// Fuzzy filter implementation
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

// Debounced input component for search
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<TextFieldProps, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const userStatusObj: UserStatusType = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
};

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>();

const RoleListTable = ({ tableData }: { tableData?: UsersType[] }) => {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<UsersType[]>(tableData || []);
  const [filteredData, setFilteredData] = useState<UsersType[]>(data);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor("role", {
        header: "Role Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Typography className="capitalize" color="text.primary">
              {row.original.role}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              variant="tonal"
              label={row.original.status}
              size="small"
              color={userStatusObj[row.original.status]}
              className="capitalize"
            />
          </div>
        ),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton onClick={() => setAddUserOpen(!addUserOpen)}>
              <i className="tabler-edit text-textSecondary" />
            </IconButton>
            <IconButton
              onClick={() => {
                setDeleteUserId(row.original.id); // Set the ID of the user to delete
                setShowDeleteDialog(true); // Open delete confirmation dialog
              }}
            >
              <i className="tabler-trash text-textSecondary" />
            </IconButton>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [data]
  );

  const table = useReactTable<UsersTypeWithAction>({
    data: filteredData as UsersTypeWithAction[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDeleteConfirm = () => {
    if (deleteUserId !== null) {
      setData((prevData) =>
        prevData.filter((user) => user.id !== deleteUserId)
      ); // Delete the user
    }
    setShowDeleteDialog(false); // Close the dialog
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false); // Close the dialog without deleting
  };

  return (
    <>
      <Card>
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4">
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="max-sm:is-full sm:is-[70px]"
          >
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="25">25</MenuItem>
            <MenuItem value="50">50</MenuItem>
          </CustomTextField>
          <div className="flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search Roles"
              className="max-sm:is-full"
            />

            <Button
              variant="contained"
              startIcon={<i className="tabler-plus" />}
              onClick={() => setAddUserOpen(!addUserOpen)}
              className="max-sm:is-full"
            >
              Add New Role
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            "flex justify-between": header.column.getCanSort(),
                          })}
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {header.column.getCanSort() && (
                            <span>
                              {header.column.getIsSorted()
                                ? header.column.getIsSorted() === "desc"
                                  ? " 🔽"
                                  : " 🔼"
                                : ""}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page);
          }}
        />
      </Card>

      {/* Add Role Drawer */}
      <AddRoleDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
      />

      {/* Delete Confirmation Dialog */}
      <DialogsAlert
        open={showDeleteDialog}
        title="Delete "
        description="Are you sure you want to delete this role?"
        agreeText="Yes"
        disagreeText="No"
        onAgree={handleDeleteConfirm}
        onDisagree={handleDeleteCancel}
        onClose={() => setShowDeleteDialog(false)} 
      />
    </>
  );
};

export default RoleListTable;
