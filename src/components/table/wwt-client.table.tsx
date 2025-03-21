"use client";

import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTablePagination } from "../ui/data-table-pagination";
import { useRouter } from "next/navigation";

const columns: Array<ColumnDef<WWTClient>> = [
  {
    accessorKey: "accountId",
    header: "AccountID",
  },
  {
    accessorKey: "userName",
    header: "Nome do cliente",
  },
  {
    accessorKey: "accountName",
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
  pagination?: {
    count: number;
    pageSize: number;
  };
}

export function WWTClientTable({ data, pagination }: WWTClientTableProps) {
  const router = useRouter();

  function handleTableRowClick(data: WWTClient) {
    router.push(`/clients/${data.accountId}`);
  }

  return (
    <section className="space-y-4">
      <DataTable
        data={data}
        columns={columns}
        onRowClick={handleTableRowClick}
      />

      {pagination && (
        <DataTablePagination
          count={pagination.count}
          pageSize={pagination.pageSize}
        />
      )}
    </section>
  );
}
