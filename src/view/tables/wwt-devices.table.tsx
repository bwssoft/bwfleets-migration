"use client";

import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { DataTable } from "@/view/components/ui/data-table";
import { DataTablePagination } from "@/view/components/ui/data-table-pagination";

const columns: Array<ColumnDef<any>> = [];

interface WWTDevicesTableProps {
  data: Array<WWTClient>;
  pagination?: {
    count: number;
    pageSize: number;
  };
}

export function WWTDevicesTable({ data, pagination }: WWTDevicesTableProps) {
  const router = useRouter();

  function handleTableRowClick(data: WWTClient) {
    router.push(`/wwt/clients/${data.accountId}`);
  }

  return (
    <section className="space-y-4 bg-card">
      <DataTable
        data={data}
        columns={columns}
        onRowClick={handleTableRowClick}
      />

      {/* {pagination && (
        <DataTablePagination
          count={pagination.count}
          pageSize={pagination.pageSize}
        />
      )} */}
    </section>
  );
}
