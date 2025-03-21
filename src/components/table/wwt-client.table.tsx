"use client";

import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

const columns: Array<ColumnDef<WWTClient>> = [
  {
    accessorKey: "accountName",
    header: "Nome do cliente",
  },
  {
    accessorKey: "userName",
    header: "Username",
  },
  {
    accessorKey: "accountStatsBean.deviceNo",
    header: "Qnt. de dispositivos",
  },
  {
    accessorKey: "accountStatsBean.onlineDeviceNo",
    header: "Qnt. de dispositivos online",
  },
  {
    accessorKey: "isLeaf",
    header: "Qnt. de subclientes",
  },
];

interface WWTClientTableProps {
  data: Array<WWTClient>;
}

export function WWTClientTable({ data }: WWTClientTableProps) {
  return <DataTable data={data} columns={columns} />;
}
