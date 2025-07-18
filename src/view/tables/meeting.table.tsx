'use client'

import { IMeeting } from '@/@shared/interfaces/Meeting';
import React from 'react';
import { DataTable } from '../components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { format, isWithinInterval, setDefaultOptions } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '../components/ui/badge';
import { IScheduleSlot } from '@/@shared/interfaces/schedule-slot';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { formatName, getInitials } from '@/@shared/utils/get-initials';
import { DataTablePagination } from '../components/ui/data-table-pagination';
import { Button } from '../components/ui/button';
import { useDisclosure } from '@/@shared/hooks/use-disclosure';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { MeetingCancel } from '../dialog/MeetingCancel';
import { toast } from 'sonner';

interface MeetingTableProps {
  data: Array<IMeeting>
  pagination?: {
    count: number;
    pageSize: number;
  };
}

setDefaultOptions({
  locale: ptBR
})

export const MeetingTable: React.FC<MeetingTableProps> = ({ data, pagination }) => {
  const formatTime = ({ end, start }: Pick<IScheduleSlot, 'start' | 'end'>) => {
    const startTime = format(start, 'HH:mm');
    const endTime = format(end, 'HH:mm')
    return [startTime, endTime].join(' - ')
  }

  const meetingCancelDisclousure = useDisclosure<IMeeting>();

  const columns: Array<ColumnDef<IMeeting>> = [
    {
      id: "client_id",
      cell: ({ row }) => {
        return row.original.account?.userName ?? row.original.client?.bwfleet.name
      },
      header: "Reunião com"
    },
    {
      id: 'organizer_id',
      cell: ({ row }) => {
        return (
          <div className="flex  gap-2 items-baseline">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">
                {getInitials(row.original.organizer.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold">
              {formatName(row.original.organizer.name)}
            </span>
          </div>
        )
      },
      header: "Organizador"
    },
    {
      id: "data",
      cell: ({ row }) => {
        return format(new Date(row.original.slot.start), "EEEE, MMMM dd, yyyy")
      },
      header: "Data"
    },
    {
      id: "time",
      cell: ({ row }) => {
        return formatTime(row.original.slot)
      },
      header: "Horário"
    },
    {
      id: "status",
      cell: ({ row }) => {
        const startDate = new Date(row.original.slot.start)
        const endDate = new Date(row.original.slot.end)
        const withinInterval = isWithinInterval(new Date(), {
          start: startDate,
          end: endDate
        });

        if(withinInterval) {
          return <Badge variant={'blue'}>Em andamento</Badge>
        }

        if(startDate > new Date()) {
          return <Badge variant={'default'}>Agendado</Badge>
        }

        if(endDate <= new Date()) {
          return <Badge variant={'green'}>Concluída</Badge>
        }

        return <Badge variant={'default'}>Agendado</Badge>
      },
      header: "Status"
    },
    {
      id: 'actions',
      header: "Ações",
      cell: ({ row }) => {

        if(row.original.slot.status === 'CANCELED') {
          return (
            <Button size={"sm"} >Reagendar Reunião</Button>
          )
        }

        const startDate = new Date(row.original.slot.start)
        const endDate = new Date(row.original.slot.end)
        const withinInterval = isWithinInterval(new Date(), {
          start: startDate,
          end: endDate
        });

        const disabled = withinInterval || endDate <= new Date()

        return (
          <Button size={"sm"} variant={disabled ? "outline" : "outline"} onClick={() => meetingCancelDisclousure.onOpen(row.original)} disabled={disabled} >Cancelar Reunião</Button>
        )
      } 
    }
  ]

  const handleCancelMeeting = async () => {
    try {
      const data = meetingCancelDisclousure.data;
      if(!data) return

      const response = await fetch(`meeting/cancel`, {
        method: "POST",
        body: JSON.stringify({ meeting_id: data.id }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      const { success } = await response.json()
      if(!success) {
        toast.error("Falha ao cancelar agendamento!")
      }
      
      toast.success("Agendamento cancelado com sucesso!")
    
    }
    finally {
      meetingCancelDisclousure.onClose()  
    }
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
      <Dialog open={meetingCancelDisclousure.isOpen} onOpenChange={meetingCancelDisclousure.onClose}>
        <DialogContent className="w-full max-h-[30vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Cancelar agendamento com {meetingCancelDisclousure.data?.account?.userName}
            </DialogTitle>
              <MeetingCancel 
                handleCancel={meetingCancelDisclousure.onClose}
                handleConfirm={handleCancelMeeting}
              />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}
