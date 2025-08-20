'use client'

import { IBfleetClientEntity } from '@/@shared/interfaces/bfleet-client-entity';
import React, { ComponentProps, useMemo } from 'react';
import { DataTable } from '../components/ui/data-table';
import { DataTablePagination } from '../components/ui/data-table-pagination';
import { ColumnDef } from '@tanstack/react-table';
import { ClipboardIcon, User, Video } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useDisclosure } from '@/@shared/hooks/use-disclosure';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Spinner } from '../components/ui';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { formatName, getInitials } from '@/@shared/utils/get-initials';
import { CreateMeeting } from '../forms/create-meeting.form';
import { ViewMeetingForm } from '../forms/view-meeting.form';
import { Badge } from '../components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { IScheduleSlot } from '@/@shared/interfaces/schedule-slot';

interface BFleetClientTableProps {
  data: Array<IBfleetClientEntity>
  pagination?: {
    count: number;
    pageSize: number;
  };
}



export function BFleetClientsTable({ data, pagination }: BFleetClientTableProps) {

  const accessLinkDisclosure = useDisclosure<{ isLoading: boolean, data?: { ttoken: string } }>({ default: { isLoading: true } });
  const createMeetingDisclousure = useDisclosure<IBfleetClientEntity>();
  const viewMeetingDisclousure = useDisclosure<IBfleetClientEntity>();

  // const waitTimeout = (ms: number) => {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  // const handleGenAccessLink = async (client: IBfleetClientEntity) => {
  //   try {
  //     accessLinkDisclosure.setData({
  //       isLoading: true,
  //       data: undefined
  //     });
  //     accessLinkDisclosure.onOpen();
  //     await waitTimeout(1000);
  //     await bWFleetsProvider.generateAccessLink({
  //       query: {
  //         uuid: client.bwfleet.uuid!,
  //       }
  //     }).then((response) => {
  //       const url = `https://bwfleets.com/welcome?token=${response.response.ttoken}`;
  //       accessLinkDisclosure.setData({
  //         isLoading: false,
  //         data: {
  //           ttoken: url,
  //         },
  //       });
  //     })

      
  //   } catch {
  //     toast.error("Erro ao gerar o link de acesso. Tente novamente mais tarde.");
  //     accessLinkDisclosure.setData({
  //       isLoading: false,
  //       data: undefined,
  //     });
  //     accessLinkDisclosure.onClose();
  //   }
  // }

  const isLoadingGenAccessLink = useMemo(() => {
    return accessLinkDisclosure.data?.isLoading ?? true;
  }, [accessLinkDisclosure.data?.isLoading]);

  function handleURLCopy(url: string | undefined) {
		if (!url) return

		navigator.clipboard.writeText(url)
		toast.success("Link de acesso copiado com sucesso!")
	}

  const formatTime = ({ end, start }: Pick<IScheduleSlot, 'start' | 'end'>) => {
    const startTime = format(start, 'HH:mm');
    const endTime = format(end, 'HH:mm')
    return [startTime, endTime].join(' - ')
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
          accessorKey: "migration",
          header: "Treinamento",
          cell: ({ row: { original: data } }) => {

    
            if(data.Meeting[0] && data.Meeting[0].status === 'BOOKED') {
              let badgeTheme: ComponentProps<typeof Badge>['variant'] = 'default';
              let label: string = "Reunião Agendada";
              const meeting = data.Meeting[0];
              
              if(meeting.status === 'CANCELED') {
                return (
                  <div className="flex flex-col justify-center gap-1">
                    <span className="font-semibold">Reunião cancelada</span>
                      <Badge variant={'destructive'} >
                        Cancelada
                      </Badge>
                  </div>
                )
              }
              if(!meeting.slot) return '--'
    
              const { start, end } = meeting.slot;
              const startDate = new Date(start)
              const endDate = new Date(end)
    
              const withinInterval = isWithinInterval(new Date(), {
                start: startDate,
                end: endDate
              });
              
      
              if(withinInterval) {
                label = "Em andamento"
                badgeTheme = 'blue'
              }
      
              if(startDate > new Date()) {
                label = "Reunião Agendada"
                badgeTheme = 'default'
              }
      
              if(endDate <= new Date()) {
                label = "Reunião Concluída"
                badgeTheme = 'green'
              }
      
              
              return (
                <div className="flex flex-col justify-center gap-1">
                  <span className="font-semibold">{label}</span>
                    <Badge variant={badgeTheme} >
                      <span>{format(new Date(start), "dd/MM/yyyy")} /</span>
                      <span className='font-semibold'>{formatTime(meeting.slot)}</span>
                    </Badge>
                </div>
              )
            }
    
            return <Badge variant={"green"} >Treinamento disponível</Badge>
          }
        },
    {
      id: "assigned",
      header: "Responsável",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex  gap-2 items-baseline">
            {data.assigned_name ? (
              <>
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">
                    {data.assigned_name ? (
                      getInitials(data.assigned_name)
                    ) : (
                      <User />
                    )}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold">
                  {formatName(data.assigned_name)}
                </span>
              </>
            ) : (
              "--"
            )}
          </div>
        )
      }
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
      cell: ({ row }) => {
        const data = row.original;

        if(data.Meeting[0] && data.Meeting[0].status !== "CANCELED") {
          return (
            <Button size={"sm"} variant={'outline'} onClick={() => {
              viewMeetingDisclousure.onOpen(data)
            }}>
              <Video />
              <span>Visualizar Reunião</span>
            </Button>
          )
        }

        return (
        <Button size={"sm"} onClick={() => 
          createMeetingDisclousure.onOpen(data)
        }>
          <Video />
          <span>Agendar Reunião</span>
        </Button>
      )
      },
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

        <Dialog
          open={createMeetingDisclousure.isOpen}
          onOpenChange={createMeetingDisclousure.onClose}
        >
          {
            createMeetingDisclousure.data && (
              <CreateMeeting onClose={createMeetingDisclousure.onClose} data={createMeetingDisclousure.data} />
            )
          }
        </Dialog>
        <Dialog
          open={viewMeetingDisclousure.isOpen}
          onOpenChange={viewMeetingDisclousure.onClose}
        >
          {viewMeetingDisclousure.data && <ViewMeetingForm onClose={viewMeetingDisclousure.onClose} data={viewMeetingDisclousure.data} />}
        </Dialog>
      </section>
    );
}