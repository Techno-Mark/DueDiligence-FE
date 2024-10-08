"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import {
  MenuItem,
  TablePagination,
  TextFieldProps,
  Tooltip,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
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
import CustomChip from "@/@core/components/mui/Chip";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import { investorListType } from "@/types/apps/investorListType";
import { brandListType } from "@/types/apps/brandListType";
import { brandList } from "@/services/endpoint/brandList";
import ConfirmationDialog from "./ConfirmationDialog";
import ConfirmUpdateStatus from "./ConfirmUpdateStatus";
import ConfirmUpdateApprove from "./ConfirmUpdateApprove";
import ConfirmSendMailDialog from "./ConfirmSendMailDialog";
import trimText from "@/services/trimText";
// import ConfirmationDialog from "./ConfirmationDialog";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type BrandTypeWithAction = brandListType & {
  action?: string;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
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

const columnHelper = createColumnHelper<BrandTypeWithAction>();

const BrandListTable = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const router = useRouter();

  const [data, setData] = useState<investorListType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [deletingId, setDeletingId] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [sendingMailBrandId, setSendingMailBrandId] = useState<number>(0);
  const [isSendingMail, setIsSendingMail] = useState<boolean>(false);

  const [statusUpdatingId, setStatusUpdatingId] = useState<number>(0);
  const [isStatusUpdating, setIsStatusUpdating] = useState<boolean>(false);
  const [approveUpdatingId, setApproveUpdatingId] = useState<number>(0);
  const [isApproveUpdating, setIsApproveUpdating] = useState<boolean>(false);
  const [changeStatusValue, setChangeStatusValue] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const result = await post(brandList.list, {
        page: page + 1,
        limit: pageSize,
        search: globalFilter,
        active: activeFilter,
      });
      setData(result.ResponseData.brands);
      setTotalRows(result.ResponseData.totalRecords);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, pageSize, globalFilter, activeFilter]);

  useEffect(() => {
    if (statusUpdatingId == -1) {
      getData();
    }
  }, [statusUpdatingId]);
  useEffect(() => {
    if (approveUpdatingId == -1) {
      getData();
    }
  }, [approveUpdatingId]);
  useEffect(() => {
    if (deletingId == -1) {
      getData();
    }
  }, [deletingId]);

  const columns = useMemo<ColumnDef<BrandTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor("srNo", {
        header: "Sr. No.",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {row.index + 1 + page * pageSize}
          </Typography>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("brandName", {
        header: "Brand Name",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.brandName)}
          </Typography>
        ),
      }),
      columnHelper.accessor("subCategory", {
        header: "Sub Category",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.subCategory)}
          </Typography>
        ),
        enableSorting: true,
      }),
      // columnHelper.accessor("phoneNumber", {
      //   header: "Phone Number",
      //   cell: ({ row }) => (
      //     <Typography color="text.primary" className="font-medium">
      //       {row.original.countryCode + " " + row.original.phoneNumber}
      //     </Typography>
      //   ),
      //   enableSorting: true,
      // }),

      columnHelper.accessor("investmentRange", {
        header: "Investment Range",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.investmentRange)}
          </Typography>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("numberOfLocations", {
        header: "Locations",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.numberOfLocations)}
          </Typography>
        ),
      }),
      columnHelper.accessor("areaaRequired", {
        header: "area",
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {trimText(row.original.areaaRequired)}
          </Typography>
        ),
      }),

      columnHelper.accessor("active", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center">
            <CustomChip
              className={`${row.original.approved ? "cursor-pointer" : "cursor-not-allowed"}`}
              size="small"
              round="true"
              label={row.original.active ? "Active" : "Inactive"}
              variant="tonal"
              color={row.original.active ? "success" : "warning"}
              onClick={() => {
                if (row.original.approved) {
                  setChangeStatusValue(row.original.active);
                  setIsStatusUpdating(true);
                  setStatusUpdatingId(row.original.id);
                }
              }}
            />
          </div>
        ),
        enableSorting: false,
      }),

      columnHelper.accessor("approved", {
        header: "Approve",
        cell: ({ row }) => (
          <div className="flex items-center">
            <CustomChip
              className="cursor-pointer"
              size="small"
              round="true"
              label={row.original.approved ? "Approved" : "Rejected"}
              variant="tonal"
              color={row.original.approved ? "success" : "error"}
              onClick={() => {
                setIsApproveUpdating(true);
                setApproveUpdatingId(row.original.id);
                setChangeStatusValue(row.original.approved);
              }}
            />
          </div>
        ),
        enableSorting: false,
      }),

      columnHelper.accessor("id", {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Tooltip title="View Details" placement="top">
              <IconButton
                onClick={() => router.push(`/home/detail/${row.original.id}`)}
              >
                <i className="tabler-external-link text-[22px] text-textSecondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Details" placement="top">
              <IconButton
                onClick={() => router.push(`/home/edit/${row.original.id}`)}
              >
                <i className="tabler-edit text-[22px] text-textSecondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top">
              <IconButton
                onClick={() => {
                  setIsDeleting(true);
                  setDeletingId(row.original.id);
                }}
              >
                <i className="tabler-trash text-[22px] text-textSecondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send Verification Email" placement="top">
              <IconButton
                onClick={() => {
                  setIsSendingMail(true);
                  setSendingMailBrandId(row.original.id);
                }}
              >
                <i className="tabler-mail text-[22px] text-textSecondary" />
              </IconButton>
            </Tooltip>
          </div>
        ),
        enableSorting: false,
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
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center py-2 gap-4">
          <div className="h-10 flex items-center">
            <div>
              <Typography variant="h5" className={`capitalize cursor-pointer`}>
                &nbsp; Brand List &nbsp;
              </Typography>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
            {/* <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search"
              className="is-full sm:is-auto"
            /> */}
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
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </CustomTextField>
            </div>
            {/* <Button
              variant="contained"
              startIcon={<i className="tabler-plus" />}
              onClick={() => router.push("/content-management/events/add")}
              className="is-full sm:is-auto"
            >
              Add Event
            </Button> */}
          </div>
        </div>
        <Card className="flex flex-col h-full">
          <div className="overflow-x-auto sm:h-[380px] md:h-[400px] lg:h-[460px]">
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
              {table.getFilteredRowModel().rows.length === 0 ? (
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
        <ConfirmationDialog
          open={isDeleting}
          deletingId={deletingId}
          setDeletingId={setDeletingId}
          setOpen={(arg1: boolean) => setIsDeleting(arg1)}
        />
        {isStatusUpdating && (
          <ConfirmUpdateStatus
            statusValue={changeStatusValue}
            open={isStatusUpdating}
            statusUpdatingId={statusUpdatingId}
            setStatusUpdatingId={setStatusUpdatingId}
            setOpen={(arg1: boolean) => setIsStatusUpdating(arg1)}
          />
        )}
        {isApproveUpdating && (
          <ConfirmUpdateApprove
            statusValue={changeStatusValue}
            open={isApproveUpdating}
            approveUpdatingId={approveUpdatingId}
            setApproveUpdatingId={setApproveUpdatingId}
            setOpen={(arg1: boolean) => setIsApproveUpdating(arg1)}
          />
        )}
        {isSendingMail && (
          <ConfirmSendMailDialog
            open={isSendingMail}
            sendingBrandId={sendingMailBrandId}
            setsendingBrandId={setSendingMailBrandId}
            setOpen={(arg1: boolean) => setIsSendingMail(arg1)}
          />
        )}
      </div>
    </>
  );
};

export default BrandListTable;
