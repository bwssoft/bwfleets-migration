"use client";

import { IWanwayClient } from "@/@shared/interfaces/wwt-client";
import { authClient } from "@/@shared/lib/better-auth/auth-client";
import { formatName, getInitials } from "@/@shared/utils/get-initials";
import { Badge } from "@/view/components/ui/badge";
import { DataTable } from "@/view/components/ui/data-table";
import { DataTablePagination } from "@/view/components/ui/data-table-pagination";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon, LoaderIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { startMigration } from "@/@shared/actions/migration.action";

interface WWTClientTableProps {
  data: Array<IWanwayClient>;
  pagination?: {
    count: number;
    pageSize: number;
  };
}

export function WWTClientTable({ data, pagination }: WWTClientTableProps) {
  const router = useRouter();
  const session = authClient.useSession();

  const [isPending, startTransition] = useTransition();
  const [peddingId, setPeddingId] = useState<string>();

  const currentUser = useMemo(() => {
    const user = session.data?.user;
    return user;
  }, [session.data]);

  const handleBeingResponsibleClient = async (wwtClient: IWanwayClient) => {
    if (!currentUser) return;

    setPeddingId(wwtClient.accountId.toString());
    startTransition(async () => {
      await startMigration({
        status: "PENDING",
        user: currentUser,
        wwtClient,
      });
    });
  };

  function handleTableRowClick(data: IWanwayClient) {
    router.push(`/wwt/clients/${data.accountId}`);
  }

  const columns: Array<ColumnDef<IWanwayClient>> = [
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
      accessorKey: "accountStatsBean.deviceTotalNo",
      header: "Dispositivos",
    },
    {
      accessorKey: "isLeaf",
      header: "Subclientes",
    },
    {
      accessorKey: "email",
      header: "Responsável",
      cell: ({ row: { original: data } }) => (
        <div className="flex  gap-2 items-baseline">
          {data.migration?.assigned?.name ? (
            <>
              <Avatar className="size-7">
                <AvatarFallback className="text-xs">
                  {data.migration?.assigned?.name ? (
                    getInitials(data.migration?.assigned.name)
                  ) : (
                    <User />
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold">
                {formatName(data.migration?.assigned?.name)}
              </span>
            </>
          ) : (
            "--"
          )}
        </div>
      ),
    },
    {
      accessorKey: "migrationStatus",
      header: "Status de migração",
      cell: ({ row: { original: data } }) => {
        switch (data.migration?.migration_status) {
          case "TO_DO":
            return <Badge>Pendente</Badge>;
          case "WAITING":
            return <Badge variant="yellow">Aguardando</Badge>;
          case "FAILED_BY_CLIENT":
            return <Badge variant="red">Recusado</Badge>;
          case "FAILED_BY_CONTACT":
            return <Badge variant="red">Sem contato</Badge>;
          case "PENDING":
            return <Badge variant="blue">Em Andamento</Badge>;
          case "DONE":
            return <Badge variant="green">Aceitou migrar</Badge>;
          default:
            return <Badge>Pendente</Badge>;
        }
      },
    },
    {
      accessorKey: "id",
      header: "Ações",
      cell: ({ row: { original: data } }) => {
        const isDisabled =
          data.migration?.migration_status !== "TO_DO" &&
          data.migration?.migration_status !== null &&
          data.migration?.migration_status !== undefined;

        return (
          <Button
            id="action-button"
            onClick={() => handleBeingResponsibleClient(data)}
            disabled={isDisabled}
            variant="outline"
            size="sm"
          >
            {isPending && peddingId === data.id ? (
              <LoaderIcon className="animate-spin h-4 w-4" />
            ) : (
              "Iniciar Processo"
            )}
          </Button>
        );
      },
    },
  ];

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
