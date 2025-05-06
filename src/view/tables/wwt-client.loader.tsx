"use server";

import { findManyClients } from "@/@shared/actions/wwt-client.actions";
import { WWTClientTable } from "./wwt-client.table";
import { IClientsPageParams } from "@/app/(auth)/wwt/clients/params";

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
      migrationStatus: {
        in: params.status ?? [],
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
      // @ts-expect-error Ítalo: Eu não entendo do prisma mas isso me parece algo relacionado ao schema, mas não consegui resolver
      data={data}
      pagination={{
        count,
        pageSize: 100,
      }}
    />
  );
}
