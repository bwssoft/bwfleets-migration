"use client";

import { assignMigrationResponsibility } from "@/@shared/actions/wwt-client.actions";
import { WWTClient } from "@/@shared/interfaces/wwt-client";
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

interface WWTClientTableProps {
  data: Array<WWTClient>;
  pagination?: {
    count: number;
    pageSize: number;
  };
}

export function WWTClientTable({ data, pagination }: WWTClientTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const session = authClient.useSession();
  const [peddingId, setPeddingId] = useState<string>();
  const currentUser = useMemo(() => {
    const user = session.data?.user;
    return user;
  }, [session.data]);

  const handleBeingResponsibleClient = async ({
    client_id,
  }: {
    client_id: string;
  }) => {
    if (!currentUser) return;

    setPeddingId(client_id);
    startTransition(async () => {
      await assignMigrationResponsibility({
        client_id,
        user_id: currentUser.id,
      });
    });
  };

  function handleTableRowClick(data: WWTClient) {
    router.push(`/wwt/clients/${data.accountId}`);
  }

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
          {data.assigned?.name ? (
            <>
              <Avatar>
                <AvatarFallback>
                  {data.assigned?.name ? (
                    getInitials(data.assigned.name)
                  ) : (
                    <User />
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold">
                {formatName(data.assigned?.name)}
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
        switch (data.migrationStatus) {
          case "TO_DO": 
              return <Badge>Pendente</Badge>;
          case "WAITING": 
              return <Badge>Aguardando</Badge>;
          case "FAILED_BY_CLIENT": 
              return <Badge variant="yellow">Recusado</Badge>;
          case "FAILED_BY_CONTACT": 
              return <Badge variant="yellow">Sem contato</Badge>;
          case "PENDING":
            return <Badge variant="default">Em Andamento</Badge>;
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
          data.migrationStatus !== "TO_DO" &&
          data.migrationStatus !== null &&
          data.migrationStatus !== undefined;

        return (
          <Button
            id="action-button"
            onClick={() => handleBeingResponsibleClient({ client_id: data.id })}
            disabled={isDisabled}
            variant="outline"
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
