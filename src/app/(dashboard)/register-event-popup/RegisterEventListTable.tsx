"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import { TablePagination, TextFieldProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import classnames from "classnames";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
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
import CustomTextField from "@core/components/mui/TextField";
import tableStyles from "@core/styles/table.module.css";
import { post } from "@/services/apiService";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import { registerEventType } from "@/types/apps/registerEventListType";
import trimText from "@/services/trimText";
import { registerEvent } from "@/services/endpoint/register-event";
// import ConfirmationDialog from "./ConfirmationDialog";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type EventTypeWithAction = registerEventType & {
  // action?: string;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Extracting date part only (YYYY-MM-DD)
};

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
  }, [value, onChange, debounce]);

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const columnHelper = createColumnHelper<EventTypeWithAction>();

const RegisterEventListTable = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const router = useRouter();

  const [data, setData] = useState<registerEventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const result = await post(registerEvent.list, {
          page: page + 1,
          limit: pageSize,
        });
        setData(result.ResponseData.registerEventLists);
        setTotalRows(result.ResponseData.totalRecords);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [page, pageSize, globalFilter]);

  const columns = useMemo<ColumnDef<EventTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor("id", {
        header: "Sr. No.",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {row.index + 1 + page * pageSize}
          </Typography>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("name", {
        header: "Full Name",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.name)}
          </Typography>
        ),
      }),
      columnHelper.accessor("jobTitle", {
        header: "Job Title",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.jobTitle)}
          </Typography>
        ),
      }),
      columnHelper.accessor("investmentCapital", {
        header: "Investment Capital",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.investmentCapital)}
          </Typography>
        ),
      }),
      columnHelper.accessor("email", {
        header: "email",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.email)}
          </Typography>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("phoneNumber", {
        header: "Phone Number",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.phoneNumber)}
          </Typography>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("state", {
        header: "State",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.state)}
          </Typography>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("city", {
        header: "City",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.city)}
          </Typography>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("createAt", {
        header: "Create",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {formatDate(row.original.createAt)}
          </Typography>
        ),
        enableSorting: true,
      }),
    ],
    [router, page, pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: {
      rowSelection,
      globalFilter,
      pagination: { pageIndex: page, pageSize },
    },
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalRows / pageSize),
  });

  const handlePageChange = (event: unknown, newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="max-h-[75vh]">
        <LoadingBackdrop isLoading={loading} />
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center gap-4">
          <div className="h-10 flex items-center">
            <div>
              <Typography variant="h5" className={`capitalize cursor-pointer`}>
                &nbsp; Register Event List &nbsp;
              </Typography>
            </div>
          </div>
          {/* <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search"
              className="is-full sm:is-auto"
            />
            <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
              <Typography>Status:</Typography>
              <CustomTextField
                select
                fullWidth
                defaultValue="all"
                id="custom-select"
                value={
                  activeFilter === null
                    ? "all"
                    : activeFilter === true
                      ? "active"
                      : "inactive"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setActiveFilter(
                    value === "active"
                      ? true
                      : value === "inactive"
                        ? false
                        : null
                  );
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Publish</MenuItem>
                <MenuItem value="inactive">Draft</MenuItem>
              </CustomTextField>
            </div>
            <Button
              variant="contained"
              startIcon={<i className="tabler-plus" />}
              onClick={() => router.push("/content-management/events/add")}
              className="is-full sm:is-auto"
            >
              Add Event
            </Button>
          </div> */}
        </div>
        <Card className="flex flex-col h-full">
          <div className="overflow-x-auto sm:h-[380px] md:h-[400px] lg:h-[475px]">
            <table className={tableStyles.table}>
              <thead className="">
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
                              desc: (
                                <i className="tabler-chevron-down text-xl" />
                              ),
                            }[header.column.getIsSorted() as "asc" | "desc"] ??
                              null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {table?.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td
                      colSpan={table.getVisibleFlatColumns().length}
                      className="text-center"
                    >
                      No data available
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={classnames({
                        selected: row.getIsSelected(),
                      })}
                    >
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
              )}
            </table>
          </div>
          <TablePagination
            component="div"
            count={totalRows}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Card>
        {/* <ConfirmationDialog
          open={isDeleting}
          deletingId={deletingId}
          setDeletingId={setDeletingId}
          setOpen={(arg1: boolean) => setIsDeleting(arg1)}
        /> */}
      </div>
    </>
  );
};

export default RegisterEventListTable;
