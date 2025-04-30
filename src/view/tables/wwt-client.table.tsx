"use client";

import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Badge } from "@/view/components/ui/badge";
import { DataTable } from "@/view/components/ui/data-table";
import { DataTablePagination } from "@/view/components/ui/data-table-pagination";
import { ExternalLinkIcon } from "lucide-react";

const columns: Array<ColumnDef<WWTClient>> = [
  {
    id: "action",
    header: "#",
    cell: () => <ExternalLinkIcon size="15" />,
  },
  {
    accessorKey: "accountId",
    header: "ID",
  },
  {
    accessorKey: "userName",
    header: "Nome",
  },
  {
    accessorKey: "accountName",
    header: "Login",
  },
  {
    accessorKey: "accountStatsBean.deviceTotalNo",
    header: "Dispositivos",
  },
  {
    accessorKey: "isLeaf",
    header: "Subclientes",
  },
  {
    accessorKey: "migrationStatus",
    header: "Status de migração",
    cell: ({ row: { original: data } }) => {
      switch (data.migrationStatus) {
        case "in-progress":
          return <Badge variant="blue">Em progresso</Badge>;
        case "done":
          return <Badge variant="green">Migrado</Badge>;
        default:
          return <Badge variant="yellow">Pendente</Badge>;
      }
    },
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
    router.push(`/wwt/clients/${data.accountId}`);
  }

  return (
    <section className="space-y-4 bg-card">
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
