"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/view/components/ui/data-table";
import { DataTablePagination } from "@/view/components/ui/data-table-pagination";
import { device as Device } from "@prisma/client";
import { Badge } from "../components/ui/badge";
import { CheckIcon, XIcon } from "lucide-react";

const columns: Array<ColumnDef<Device>> = [
  {
    accessorKey: "imei",
    header: "IMEI",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "ownerBean.userName",
    header: "Dono",
  },
  {
    accessorKey: "useStatus",
    header: "Status de uso",
    cell: ({ row }) =>
      row.original.useStatus === 1 ? (
        <Badge variant="outline">
          <CheckIcon /> Em uso
        </Badge>
      ) : (
        <Badge variant="outline">
          <XIcon /> Inativo
        </Badge>
      ),
  },
];

interface WWTDevicesTableProps {
  data: Array<Device>;
  pagination?: {
    count: number;
    pageSize: number;
  };
}

export function WWTDevicesTable({ data, pagination }: WWTDevicesTableProps) {
  return (
    <section className="space-y-4 bg-card">
      <DataTable
        data={data}
        columns={columns}
        // onRowClick={handleTableRowClick}
      />

      {pagination && (
        <DataTablePagination
          pageUrlParam="devicesPage"
          count={pagination.count}
          pageSize={pagination.pageSize}
        />
      )}
    </section>
  );
}
