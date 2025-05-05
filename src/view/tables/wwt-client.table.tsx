"use client";

import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Badge } from "@/view/components/ui/badge";
import { DataTable } from "@/view/components/ui/data-table";
import { DataTablePagination } from "@/view/components/ui/data-table-pagination";
import { ExternalLinkIcon, LoaderIcon, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { authClient } from "@/@shared/lib/better-auth/auth-client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { assignMigrationResponsibility } from "@/@shared/actions/wwt-client.actions";
import { formatName, getInitials } from "@/@shared/utils/get-initials";

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

  useEffect(() => {
    console.log({ isPending });
  }, [isPending]);

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
      accessorKey: "email",
      header: "Responável",
      cell: ({ row: { original: data } }) => (
        <div className="flex  gap-2 items-baseline">
          <Avatar>
            <AvatarFallback>
              {data.assigned?.name ? getInitials(data.assigned.name) : <User />}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold">
            {formatName(data.assigned?.name)}
          </span>
        </div>
      ),
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
            return <Badge variant="default">Em progresso</Badge>;
          case "done":
            return <Badge>Migrado</Badge>;
          default:
            return <Badge>Pendente</Badge>;
        }
      },
    },
    {
      accessorKey: "id",
      header: "Ações",
      cell: ({ row: { original: data } }) => {
        const isDisabled = !!data.migrationStatus || isPending;

        return (
          <Button
            id="action-button"
            onClick={() => handleBeingResponsibleClient({ client_id: data.id })}
            disabled={isDisabled}
          >
            {isPending && peddingId === data.id ? (
              <LoaderIcon className="animate-spin h-4 w-4" />
            ) : (
              "Migrar"
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
