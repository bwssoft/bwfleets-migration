/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Prisma, Comment, MigrationStatus } from "@prisma/client";
import { cleanObject } from "../utils/clean-object";
import { prisma } from "../lib/prisma/prisma-client";
import { WWTClient } from "../interfaces/wwt-client";
import { parseFormData } from "../utils/parse-form-data";
import { format } from "date-fns";
import _ from "lodash";
import { revalidatePath } from "next/cache";

interface FindManyClientsParams {
  page?: number | null;
  pageSize?: number;
  where?: Prisma.clientWhereInput;
  orderBy?: Prisma.clientOrderByWithRelationInput[];
}

export async function findManyClients(params: FindManyClientsParams) {
  const { page, pageSize = 100, where, orderBy } = params;

  const formattedWhere = cleanObject(where);
  const formattedOrderBy = cleanObject(orderBy);

  const skip = !!page ? pageSize * Number(page - 1) : 0;

  const count = await prisma.client.count({
    where: formattedWhere,
  });

  const data = await prisma.client.findMany({
    skip,
    take: pageSize,
    where: formattedWhere,
    orderBy: formattedOrderBy as Prisma.clientOrderByWithRelationInput[],
    select: {
      id: true,
      userName: true,
      accountName: true,
      accountStatsBean: true,
      accountId: true,
      email: true,
      isLeaf: true,
      migrationStatus: true,
      assigned: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    data,
    count,
  };
}

interface FindOneClientParams {
  where: any;
}

export async function findOneClient(params: FindOneClientParams) {
  const { where } = params;
  return await prisma.client.findFirstOrThrow({
    where,
    select: {
      comments: {
        select: {
          client: true,
          user: true,
          clientId: true,
          createdAt: true,
          message: true,
          id: true,
          user_uuid: true,
          updatedAt: true,
        },
      },
      accountId: true,
      accountName: true,
      accountStatsBean: true,
      accountType: true,
      address: true,
      assigned: true,
      assignedId: true,
      contactTel: true,
      contactUser: true,
      createTime: true,
      email: true,
      id: true,
      isLeaf: true,
      isReceiveOfflineMessage: true,
      isReceiveWaring: true,
      migrationStatus: true,
      parentId: true,
      payUrl: true,
      resultBean: true,
      roles: true,
      rootId: true,
      success: true,
      type: true,
      userName: true,
    },
  });
}

interface UpdateMigrationStatus {
  uuid: string;
  status: MigrationStatus;
}

export async function updateMigrationStatus(formData: FormData) {
  const { uuid, status } = parseFormData(formData) as UpdateMigrationStatus;

  console.log({ uuid, status });
  return await prisma.client.update({
    data: {
      migrationStatus: status,
    },
    where: {
      id: uuid,
    },
  });
}

export type ITemplateParameters =
  | "client_name"
  | "time"
  | "qnt_device"
  | "qnt_device_online_pctg"
  | "qnt_device_ofline_pctg"
  | "qnt_client";
export type IParametersValue = {
  value?: string;
  onError?: (template: string) => string | void;
};

export async function generateUserSummary(data: WWTClient) {
  const TEMPLATE_MESSAGE =
    "Olá, {client_name}. Tudo bem? Você está com a gente desde {time} e durante todo esse tempo você atingiu os valores de {qnt_device} dispositivos, sendo {qnt_device_online_pctg} ativo e {qnt_device_ofline_pctg} inativos nos últimos meses e {qnt_client} clientes.";

  const formatTime = (value?: number): string | undefined => {
    if (!value) return;

    return format(value, "dd/MM/yyyy");
  };

  const calcPercentage = (value: number, total: number) => {
    return Math.round((value * 100) / total);
  };

  const calculateDeviceStatistics = () => {
    const { offlineDeviceNo, onlineDeviceNo, unUsedDeviceNo, deviceNo } =
      data.accountStatsBean;
    const oflinePercentage = calcPercentage(
      offlineDeviceNo + unUsedDeviceNo,
      deviceNo
    );
    const onlinePercentage = calcPercentage(onlineDeviceNo, deviceNo);

    return {
      oflinePercentage,
      onlinePercentage,
    };
  };

  const { oflinePercentage, onlinePercentage } = calculateDeviceStatistics();

  const templateParameters: Record<ITemplateParameters, IParametersValue> = {
    client_name: {
      value: data.userName,
    },
    time: {
      value: formatTime(data.createTime),
      onError: (template: string) => {
        const excludeTime =
          "Você está com a gente desde {time} e durante todo esse tempo";
        const valueToReplace = "Durante todo esse tempo com a gente, você";
        return template.replace(excludeTime, valueToReplace);
      },
    },
    qnt_device: {
      value: data.accountStatsBean.deviceNo?.toString(),
      onError: (template: string) => {
        const excludeDevice =
          "{qnt_device} dispositivos, sendo % <porcentagem ativa/inativa> nos últimos meses e";
        const valueToReplace = "";
        return template.replace(excludeDevice, valueToReplace);
      },
    },
    qnt_device_online_pctg: {
      value: onlinePercentage ? `${onlinePercentage}%` : undefined,
      onError: (template: string) => {
        const exclude = "{qnt_device_online_pctg} ativo e";
        const valueToReplace = "";
        return template.replace(exclude, valueToReplace);
      },
    },
    qnt_device_ofline_pctg: {
      value: oflinePercentage ? `${oflinePercentage}%` : undefined,
      onError: (template: string) => {
        const exclude = "{qnt_device_ofline_pctg} desativados";
        const valueToReplace = "";
        return template.replace(exclude, valueToReplace);
      },
    },
    qnt_client: {
      value: data.isLeaf.toString(),
      onError: (template: string) => {
        const exclude = " e {qnt_client} clientes";
        const valueToReplace = "";
        return template.replace(exclude, valueToReplace);
      },
    },
  };

  const parameterskey = Object.keys(
    templateParameters
  ) as Array<ITemplateParameters>;

  const isValidValue = (value?: string) => {
    if (!value) return false;

    if (_.isEmpty(value) || value === "0") return false;

    return true;
  };

  let response = TEMPLATE_MESSAGE;
  parameterskey.forEach((key) => {
    const parameter = templateParameters[key];
    const isValid = isValidValue(parameter.value);
    if (!isValid) {
      const reply = parameter.onError?.(response);
      if (reply) {
        return (response = reply);
      }
    }
    response = response.replace(`{${key}}`, parameter.value!);
  });

  return response;
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AssignMigrationResponsibility {
  export type Params = {
    client_id: string;
    user_id: string;
  };
}

export async function assignMigrationResponsibility(
  params: AssignMigrationResponsibility.Params
) {
  const { client_id, user_id } = params;

  await prisma.client.update({
    where: {
      id: client_id,
    },
    data: {
      assignedId: user_id,
      migrationStatus: "PENDING",
    },
  });
  revalidatePath("/wwt/clients");
}

export async function writeMigrationComment({
  data,
}: {
  data: Partial<Comment>;
}) {
  await prisma.comment.create({
    data: data as Comment,
  });

  revalidatePath(`/wwt/clients/${data.clientId}`);
}
