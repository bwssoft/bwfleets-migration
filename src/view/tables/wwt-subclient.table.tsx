"use client";

import { IWanwaySubclient } from "@/@shared/interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { DataTable } from "@/view/components/ui/data-table";
import { DataTablePagination } from "@/view/components/ui/data-table-pagination";
import { ExternalLinkIcon } from "lucide-react";

const columns: Array<ColumnDef<IWanwaySubclient>> = [
  {
    id: "action",
    header: "#",
    cell: () => <ExternalLinkIcon size="15" />,
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
  data: Array<IWanwaySubclient>;
  pagination?: {
    count: number;
    pageSize: number;
    pageUrlParam?: string;
  };
}

export function WWTSubclientTable({ data, pagination }: WWTClientTableProps) {
  const router = useRouter();

  function handleTableRowClick(data: IWanwaySubclient) {
    router.push(`/wwt/clients/${data.accountId}`);
  }

  return (
    <section className="space-y-4 bg-card">
      <DataTable
        data={data}
        columns={columns}
        onRowClick={handleTableRowClick}
      />

      {pagination && <DataTablePagination {...pagination} />}
    </section>
  );
}
