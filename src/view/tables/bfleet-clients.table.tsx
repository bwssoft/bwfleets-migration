'use client'

import { IBfleetClientEntity } from '@/@shared/interfaces/bfleet-client-entity';
import React, { useMemo } from 'react';
import { DataTable } from '../components/ui/data-table';
import { DataTablePagination } from '../components/ui/data-table-pagination';
import { ColumnDef } from '@tanstack/react-table';
import { ClipboardIcon, ScanTextIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useDisclosure } from '@/@shared/hooks/use-disclosure';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Spinner } from '../components/ui';
import { BWFleetsProvider } from '@/@shared/provider/bwfleets';
import { toast } from 'sonner';

interface BFleetClientTableProps {
  data: Array<IBfleetClientEntity>
  pagination?: {
    count: number;
    pageSize: number;
  };
}



export function BFleetClientsTable({ data, pagination }: BFleetClientTableProps) {

  const accessLinkDisclosure = useDisclosure<{ isLoading: boolean, data?: { ttoken: string } }>({ default: { isLoading: true } });
  const bWFleetsProvider = new BWFleetsProvider();

  const waitTimeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleGenAccessLink = async (client: IBfleetClientEntity) => {
    try {
      accessLinkDisclosure.setData({
        isLoading: true,
        data: undefined
      });
      accessLinkDisclosure.onOpen();
      await waitTimeout(1000);
      await bWFleetsProvider.generateAccessLink({
        query: {
          uuid: client.bwfleet.uuid!,
        }
      }).then((response) => {
        accessLinkDisclosure.setData({
          isLoading: false,
          data: response.response,
        });
      })

      
    } catch {
      toast.error("Erro ao gerar o link de acesso. Tente novamente mais tarde.");
      accessLinkDisclosure.setData({
        isLoading: false,
        data: undefined,
      });
      accessLinkDisclosure.onClose();
    }
  }

  const isLoadingGenAccessLink = useMemo(() => {
    console.log("isLoadingGenAccessLink", accessLinkDisclosure.data?.isLoading)
    return accessLinkDisclosure.data?.isLoading ?? true;
  }, [accessLinkDisclosure.data?.isLoading]);

  function handleURLCopy(url: string | undefined) {
		if (!url) return

		navigator.clipboard.writeText(url)
		toast.success("Link de acesso copiado com sucesso!")
	}

  const columns: Array<ColumnDef<IBfleetClientEntity>> = [
    {
      id: "client_name",
      cell: ({ row }) => {
        return row.original.bwfleet?.name ?? '--';
      },
      header: "Nome",
    },
    {
      id: "client_email",
      cell: ({ row }) => {
        return row.original.bwfleet?.email ?? '--';
      },
      header: "Email",
    },
    {
      id: "action",
      header: "#",
      cell: ({ row }) => (
        <Button onClick={() => handleGenAccessLink(row.original)} >
          <ScanTextIcon />
          <span>Gerar link de acesso</span>
        </Button>
      ),
    },
  ]

  const LoadingAcessLink = () => {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerando o link</DialogTitle>
          <DialogDescription>
            Aguarde enquanto o link de acesso é gerado. Isso pode levar alguns segundos.
            <div className='flex items-center justify-center'>
              <Spinner className='w-8 h-8 text-muted' />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    )
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
						onClick={() => handleURLCopy(accessLinkDisclosure.data?.data?.ttoken)}
						className="flex items-center cursor-pointer justify-between gap-4 rounded-md border border-border bg-accent p-2 px-3 text-left text-muted-foreground transition-all hover:bg-accent/50"
					>
						<div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
							<span>{accessLinkDisclosure.data?.data?.ttoken ?? "--"}</span>
						</div>

						<ClipboardIcon className="h-4 w-4" />
					</button>
          </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    )
  }

  return (
      <section className="space-y-4 bg-card">
        <DataTable
          data={data}
          columns={columns}
        />
  
        {pagination && (
          <DataTablePagination
            count={pagination.count}
            pageSize={pagination.pageSize}
          />
        )}

        <Dialog
          open={accessLinkDisclosure.isOpen}
          onOpenChange={accessLinkDisclosure.onClose}
        >
          {
            isLoadingGenAccessLink ? <LoadingAcessLink /> : <AccessLinkContent />
          }
        </Dialog>
      </section>
    );
}