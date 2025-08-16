"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/@shared/utils/tw-merge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/view/components/ui/table";
import { LoaderIcon, SearchSlashIcon } from "lucide-react";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (data: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [pendingId, setPendingId] = React.useState<string | number>();
  const [isPending, startTransition] = React.useTransition();
  // const transition = useTransition(() => {
  //   onRowClick?.();
  // });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border overflow-y-auto max-h-full overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-secondary hover:bg-secondary"
            >
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={(event) => {
                  const ignoreID = ["action-button"];
                  // @ts-expect-error: event.target.id might not exist on all event targets
                  const ignoreAction = ignoreID.includes(event.target.id);
                  if (ignoreAction) {
                    return;
                  }
                  setPendingId(row.id);
                  startTransition(() => {
                    onRowClick?.(row.original);
                  });
                }}
                className={cn(
                  onRowClick !== undefined && "cursor-pointer",
                  isPending &&
                    "pointer-events-none cursor-default bg-secondary text-gray-400 opacity-80",
                  isPending &&
                    pendingId === row.id &&
                    "bg-transparent text-foreground"
                )}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell key={cell.id}>
                    {index === 0 && isPending && pendingId === row.id ? (
                      <LoaderIcon className="animate-spin h-4 w-4" />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-72 text-center hover:bg-50 bg-gray-50"
              >
                <div className="flex flex-col gap-4 items-center justify-center">
                  <div className="h-14 w-14 border border-border rounded-full bg-card flex items-center justify-center">
                    <SearchSlashIcon size="28" className="text-gray-400" />
                  </div>

                  <span className="font-medium">
                    Nenhum resultado encontrado
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
