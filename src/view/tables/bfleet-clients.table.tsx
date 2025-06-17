'use client'

import { IBfleetClientEntity } from '@/@shared/interfaces/bfleet-client-entity';
import React from 'react';
import { DataTable } from '../components/ui/data-table';
import { DataTablePagination } from '../components/ui/data-table-pagination';
import { ColumnDef } from '@tanstack/react-table';
import { CableIcon } from 'lucide-react';

interface BFleetClientTableProps {
  data: Array<IBfleetClientEntity>
  pagination?: {
    count: number;
    pageSize: number;
  };
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
    header: "Gerar link",
    cell: () => <CableIcon className='cursor-pointer' size="15" />,
  },
]

export function BFleetClientsTable({ data, pagination }: BFleetClientTableProps) {
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
    );
}