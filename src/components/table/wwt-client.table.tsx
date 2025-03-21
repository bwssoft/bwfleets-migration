"use client";

import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTablePagination } from "../ui/data-table-pagination";

const columns: Array<ColumnDef<WWTClient>> = [
  {
    accessorKey: "accountId",
    header: "AccountID",
  },
  {
    accessorKey: "accountName",
    header: "Nome do cliente",
  },
  {
    accessorKey: "userName",
    header: "Username",
  },
  {
    accessorKey: "accountStatsBean.deviceNo",
    header: "Qnt. de dispositivos",
  },
  {
    accessorKey: "accountStatsBean.onlineDeviceNo",
    header: "Qnt. de dispositivos online",
  },
  {
    accessorKey: "isLeaf",
    header: "Qnt. de subclientes",
  },
];

interface WWTClientTableProps {
  data: Array<WWTClient>;
}

export function WWTClientTable({ data }: WWTClientTableProps) {
  return (
    <section className="space-y-4">
      <DataTable data={data} columns={columns} />
      <DataTablePagination count={25000} pageSize={100} currentPage={1} />
    </section>
  );
}
