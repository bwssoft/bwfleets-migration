"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { WWTAccountStats } from "@/@shared/interfaces/wwt-client";

const columns: Array<ColumnDef<WWTAccountStats>> = [
  {
    accessorKey: "deviceNo",
    header: "Qnt. total",
  },
  {
    accessorKey: "deviceTotalNo",
    header: "Qnt. total (contando c/ subcliente)",
  },
  {
    accessorKey: "onlineDeviceNo",
    header: "Qnt. online",
  },
  {
    accessorKey: "offlineDeviceNo",
    header: "Qnt. offline",
  },
  {
    accessorKey: "unUsedDeviceNo",
    header: "Sem utilizar",
  },
];

export function WWTClientDevicesStatsTable() {
  return <DataTable data={[]} columns={columns} />;
}
