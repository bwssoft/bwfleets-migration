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
    }
  ]
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
    </section>
  )
}
