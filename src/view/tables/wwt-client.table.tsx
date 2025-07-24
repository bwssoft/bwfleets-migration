"use client";

import { IWanwayClient } from "@/@shared/interfaces/wwt-client";
import { authClient } from "@/@shared/lib/better-auth/auth-client";
import { formatName, getInitials } from "@/@shared/utils/get-initials";
import { Badge } from "@/view/components/ui/badge";
import { DataTable } from "@/view/components/ui/data-table";
import { DataTablePagination } from "@/view/components/ui/data-table-pagination";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardIcon, ExternalLinkIcon, LoaderIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { startMigration } from "@/@shared/actions/migration.action";
import { Dialog, DialogContent, DialogDescription,  DialogFooter,  DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useDisclosure } from "@/@shared/hooks/use-disclosure";
import MigrationProcess from "./@components/migration-process";
import { MigrationAccessToken } from "@prisma/client";
import LoadingAcessLink from "../forms/access-link/loading";
import { toast } from "sonner";
import { BWFleetsProvider } from "@/@shared/provider/bwfleets";
import { differenceInHours } from "date-fns";

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
  const processMigrationDisclousure = useDisclosure<{ accountId: number, id?: string }>();
  const migrationTokenDisclousure = useDisclosure<MigrationAccessToken>();
  const [pendingToken, setPendingToken] = useState<boolean>(true);
  const bWFleetsProvider = new BWFleetsProvider();

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
          case "INACTIVE":
            return <Badge variant="red">Cliente inativo</Badge>
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
          case "SUCCESS":
            return <Badge variant="green">Migração Concluída</Badge>;
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

        if(data.migration?.migration_status === 'DONE') {
          return (
            <Button id="action-button" onClick={() => processMigrationDisclousure.onOpen({ accountId: data.accountId, id: data.migration?.uuid })} size={"sm"}>Migrar dados</Button>
          )
        }

        if(data.migration?.migration_status === 'SUCCESS') {
          return (
            <Button id="action-button" onClick={() => handleGenLink(data.migration!.migration_token!, data.migration!.uuid)} >Link de acesso</Button>
          )
        }

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
            ) : isDisabled ? (
              "Processo iniciado"
            ) : (
              "Iniciar Processo"
            )}
          </Button>
        );
      },
    },
  ];

  const handleGenLink = async (data: MigrationAccessToken, id: string) => {
    setPendingToken(true)
    migrationTokenDisclousure.onOpen(data)
    try {
      const { created_at, bfleet_uuid, completed } = data
      const diffHours = differenceInHours(new Date(), created_at)
      if(diffHours >= 7 && completed === false) {
        const replyToken = await bWFleetsProvider.generateAccessLink({
          query: { uuid: bfleet_uuid }
        })
        const { ttoken } = replyToken.response
        const body = {
          token: ttoken,
          uuid: id,
          bfleet_uuid
        }
        
        await fetch('/api/migration/finish', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          }
        })

        migrationTokenDisclousure.setData({
          ...data,
          created_at: new Date(),
          token: ttoken
        })
      }
    }
    finally {
      setPendingToken(false)
    }
  }

  const onInternalClose = () => {
    processMigrationDisclousure.onClose()
    router.refresh()
  }

  const getAccessLink = useCallback((token?: string | null) => {
    const url = `https://bwfleets.com/welcome?token=${token}`;
    return url;
  }, [])

  const handleURLCopy = (url: string | undefined) => {
    if (!url) return

    navigator.clipboard.writeText(url)
    toast.success("Link de acesso copiado com sucesso!")
  }

  const AccessLinkContent = () => {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link gerado com sucesso!</DialogTitle>
          <DialogDescription>
            Use esse link para fazer o primeiro acesso ao cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3 flex flex-col space-y-2 overflow-hidden">
          <button
						onClick={() => handleURLCopy(getAccessLink(migrationTokenDisclousure.data?.token))}
						className="flex items-center cursor-pointer justify-between gap-4 rounded-md border border-border bg-accent p-2 px-3 text-left text-muted-foreground transition-all hover:bg-accent/50"
					>
						<div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
							<span>{getAccessLink(migrationTokenDisclousure.data?.token) ?? "--"}</span>
						</div>

						<ClipboardIcon className="h-4 w-4" />
					</button>
          </div>
          <DialogFooter>
            <Button onClick={migrationTokenDisclousure.onClose} >Fechar</Button>
          </DialogFooter>
      </DialogContent>
    )
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

      <Dialog
        open={migrationTokenDisclousure.isOpen}
        onOpenChange={migrationTokenDisclousure.onClose}
      >
        {pendingToken ? <LoadingAcessLink /> : <AccessLinkContent />}
      </Dialog>

      <Dialog
        open={processMigrationDisclousure.isOpen}
        onOpenChange={processMigrationDisclousure.onClose}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processo de migração</DialogTitle>
            <DialogDescription>
              Aguarde as etapas serem finalizadas
            </DialogDescription>
          </DialogHeader>
          <MigrationProcess onClose={onInternalClose} id={processMigrationDisclousure.data?.id}   accountId={processMigrationDisclousure.data?.accountId} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
