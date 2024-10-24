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
import CustomTextField from "@core/components/mui/TextField";
import DialogsAlert from "@/components/dialogs/alert-dialog";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import { ThemeColor } from "@/@core/types";
import { CardContent, CardHeader, TextFieldProps } from "@mui/material";
import TablePaginationComponent from "@/components/TablePaginationComponent";
import AddUserDrawer from "./AddUserDrawer";

interface UsersType {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  status: string;
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

const UserListTable = ({ tableData }: { tableData?: UsersType[] }) => {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedUserData, setSelectedUserData] = useState<UsersType | null>(
    null
  );
  const [data, setData] = useState<UsersType[]>(tableData || []);
  const [filteredData, setFilteredData] = useState<UsersType[]>(data);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleDrawerClose = () => {
    setAddUserOpen(false);
    setSelectedUserData(null);
  };

  const handleAddNewClick = () => {
    setSelectedUserData(null);
    setAddUserOpen(true);
  };

  const handleEditClick = (userData: UsersType) => {
    setSelectedUserData(userData);
    setAddUserOpen(true);
  };

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor((_, index) => index + 1, {
        header: "Sr. No",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Typography className="capitalize" color="text.primary">
              {row.index + 1}
            </Typography>
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("fullName", {
        header: "Full Name",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Typography className="capitalize" color="text.primary">
              {row.original.fullName}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Typography className="capitalize" color="text.primary">
              {row.original.email}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("phoneNumber", {
        header: "Phone Number",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Typography className="capitalize" color="text.primary">
              {row.original.phoneNumber}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("role", {
        header: "Access Group",
        enableSorting: true,
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
        enableSorting: true,
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
            <IconButton onClick={() => handleEditClick(row.original)}>
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
      );
    }
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card>
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4">
          <CardHeader title="User List" />
          <div className="flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search User"
              className="max-sm:is-full"
            />

            <Button
              variant="contained"
              startIcon={<i className="tabler-plus" />}
              onClick={handleAddNewClick}
              className="max-sm:is-full"
            >
              Add New User
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
                            "flex items-center": header.column.getIsSorted(),
                            "cursor-pointer select-none":
                              header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <i className="tabler-chevron-up text-xl" />,
                            desc: <i className="tabler-chevron-down text-xl" />,
                          }[header.column.getIsSorted() as "asc" | "desc"] ??
                            null}
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
      <AddUserDrawer
        open={addUserOpen}
        handleClose={handleDrawerClose}
        userData={selectedUserData}
        setData={setData}
      />

      {/* Delete Confirmation Dialog */}
      <DialogsAlert
        open={showDeleteDialog}
        title="Delete "
        description="Are you sure you want to delete this User?"
        agreeText="Yes"
        disagreeText="No"
        onAgree={handleDeleteConfirm}
        onDisagree={handleDeleteCancel}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
};

export default UserListTable;
