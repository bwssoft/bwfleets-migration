"use server";

import { findManyClients } from "@/@shared/actions/wwt-client.actions";
import { WWTClientTable } from "./wwt-client.table";
import { IClientsPageParams } from "@/app/(auth)/wwt/clients/params";
import { MigrationStatus } from "@prisma/client";

export interface WWTClientTableLoaderProps {
  params: IClientsPageParams;
}

export async function WWTClientTableLoader({
  params,
}: WWTClientTableLoaderProps) {
  const { data, count } = await findManyClients({
    page: params.page,
    where: {
      userName: {
        contains: params.name as string,
        mode: "insensitive",
      },
      accountName: {
        contains: params.login as string,
        mode: "insensitive",
      },
      parentId: !params.withSubclients
        ? {
            equals: 10160758,
          }
        : undefined,
      migration: {
        migration_status: {
          in: (params.status as MigrationStatus[]) ?? [],
        },
      },
    },
    orderBy: [
      {
        accountStatsBean: {
          deviceTotalNo: params.devicesOrderBy as never,
        },
      },
    ],
  });

  return (
    <WWTClientTable
      data={data}
      pagination={{
        count,
        pageSize: 100,
      }}
    />
  );
}
