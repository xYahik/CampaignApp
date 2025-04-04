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
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

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
import { useEffect, useState } from "react";

export type Campaign = {
  id: string;
  name: string;
  keywords: Set<String>;
  town: string;
  radius: number;
};

export function CampaignListTable() {
  const onClick = async (id: string) => {
    const result = await handleClick(id);
    if (result) {
      toast.success("Move to campaign - WIP");
    }
  };

  async function handleClick(id: string) {
    try {
      await api.post(`/campaign/${id}/check`);
      return true;
    } catch (e: any) {
      if (e.response.data == "Campaign already ended") {
        const response = await api.get("/campaign/");
        setData(response.data);
        toast.error(e.response.data);
      } else {
        toast.error(e.response.data);
      }
    }

    return false;
  }

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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const campaign = row.original;

        return <Button onClick={() => onClick(campaign.id)}>Click</Button>;
      },
    },
  ];

  const [data, setData] = useState<Campaign[]>([]);
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get("/campaign/");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };

    fetchCampaigns();
  }, []);

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
    <div className="w-full max-w-[600px] mx-auto">
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
