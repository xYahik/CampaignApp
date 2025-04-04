import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../badge";
import { toast } from "sonner";
import { api } from "@/api";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { useAuth } from "../AuthProvider";

export type Campaign = {
  id: string;
  name: string;
  keywords: Set<String>;
  town: string;
  radius: number;
};

export function UserCampaignListTable() {
  const [data, setData] = useState<Campaign[]>([]);
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get("/campaign/my");
        setData(response.data);
      } catch (err: any) {
        toast.error(err.response.data);
      }
    };

    fetchCampaigns();
  }, []);

  const { refreshUser } = useAuth();

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/campaign/${id}`);
      toast.success("The campaign was deleted.");
      const response = await api.get("/campaign/my");
      setData(response.data);
      refreshUser();
    } catch (e: any) {
      toast.error(e.response.data);
    }
  };
  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-[350px] capitalize whitespace-normal break-words">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "keywords",
      header: "Keywords",
      cell: ({ row }) => {
        const keywords: Set<string> = row.getValue("keywords");
        return (
          <div className="whitespace-normal break-words max-w-[350px]">
            {Array.from(keywords).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="lowercase">
                {keyword}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "town",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Town
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("town")}</div>
      ),
    },
    {
      accessorKey: "radius",
      header: () => <div className="text-right">Radius</div>,
      cell: ({ row }) => {
        const radius = parseFloat(row.getValue("radius"));

        const formatted = new Intl.NumberFormat("pl-PL", {
          style: "decimal",
          maximumFractionDigits: 1,
        }).format(radius);

        return <div className="text-right font-medium">{formatted}km</div>;
      },
    },
    {
      accessorKey: "bidAmount",
      header: () => <div className="text-right">Bid Amount</div>,
      cell: ({ row }) => {
        const bidAmount = parseFloat(row.getValue("bidAmount"));

        const formatted = new Intl.NumberFormat("pl-PL", {
          style: "decimal",
          maximumFractionDigits: 1,
        }).format(bidAmount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "campaignFund",
      header: () => <div className="text-right">Campaign Fund</div>,
      cell: ({ row }) => {
        const campaignFund = parseFloat(row.getValue("campaignFund"));

        const formatted = new Intl.NumberFormat("pl-PL", {
          style: "decimal",
          maximumFractionDigits: 1,
        }).format(campaignFund);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-right">Campaign Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">{row.getValue("status")}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const campaign = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-42">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger asChild>
                  <Link to={`/campaign/${campaign.id}/edit`}>
                    <Button variant="ghost" className="w-auto self-start">
                      Update campaign
                    </Button>
                  </Link>
                </DialogTrigger>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-auto self-start">
                    Delete campaign
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      campaign and remove data.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(campaign.id)}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
          //<Button onClick={() => onClick(campaign.id)}>Click</Button>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
