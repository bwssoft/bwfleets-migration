"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/view/components/ui/data-table";
import { DataTablePagination } from "@/view/components/ui/data-table-pagination";
import { User, Session } from "@prisma/client";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { CheckIcon, MoreVerticalIcon, XIcon } from "lucide-react";

type UserTableData = User & { sessions: Session[] };

const ROLE_BADGE_MAPPER = {
  admin: <Badge>Administrador</Badge>,
  user: <Badge>Comercial</Badge>,
  comercial: <Badge>Comercial</Badge>,
  support: <Badge>Suporte</Badge>,
};

const columns: Array<ColumnDef<UserTableData>> = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.banned ? "Desativado" : "Ativado"}
      </Badge>
    ),
  },
  {
    accessorKey: "firstAccess",
    header: "Configurou o acesso",
    cell: ({ row }) =>
      !row.original.firstAccess ? (
        <Badge variant="outline">
          <CheckIcon /> Sim
        </Badge>
      ) : (
        <Badge variant="outline">
          <XIcon />
          Não
        </Badge>
      ),
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "role",
    header: "Permissão",
    cell: ({ row }) =>
      ROLE_BADGE_MAPPER[row.original.role as never] ?? (
        <Badge>Não encontrado</Badge>
      ),
  },

  {
    accessorKey: "sessions",
    header: "Sessões ativas",
    cell: ({ row }) => row.original.sessions.length,
  },
  // {
  //   id: "actions",
  //   header: "",
  //   cell: ({ row }) => (
  //     <div className="flex justify-end">
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="outline" size="icon">
  //             <MoreVerticalIcon />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuItem>Desativar</DropdownMenuItem>
  //           <DropdownMenuItem>Revogar sessões</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     </div>
  //   ),
  // },
];

interface UsersTableProps {
  data: Array<UserTableData>;
  pagination?: {
    count: number;
    pageSize: number;
  };
}

export function UsersTable({ data, pagination }: UsersTableProps) {
  return (
    <section className="space-y-4 bg-card">
      <DataTable data={data} columns={columns} />

      {pagination && (
        <DataTablePagination
          count={pagination.count}
          pageSize={pagination.pageSize}
        />
      )}
    </section>
  );
}
