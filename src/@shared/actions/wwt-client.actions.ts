/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Prisma } from "@prisma/client";
import { cleanObject } from "../utils/clean-object";
import { prisma } from "../lib/prisma/prisma-client";
import { IWanwayClient } from "../interfaces/wwt-client";
import { format } from "date-fns";
import _ from "lodash";

interface FindManyClientsParams {
  page?: number | null;
  pageSize?: number;
  where?: Prisma.WanwayClientWhereInput;
  orderBy?: Prisma.WanwayClientOrderByWithRelationInput[];
}

export async function findManyClients(params: FindManyClientsParams) {
  const { page, pageSize = 100, where, orderBy } = params;

  const formattedWhere = cleanObject(where);
  const formattedOrderBy = cleanObject(orderBy);

  const skip = !!page ? pageSize * Number(page - 1) : 0;

  const count = await prisma.wanwayClient.count({
    where: formattedWhere,
  });

  const data = await prisma.wanwayClient.findMany({
    skip,
    take: pageSize,
    where: formattedWhere,
    orderBy: formattedOrderBy as Prisma.WanwayClientOrderByWithRelationInput[],
    include: {
      migration: {
        include: {
          assigned: true,
          comments: {
            include: {
              user: true,
            },
          },
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

export async function findOneClient(params: FindOneClientParams): Promise<
  Prisma.WanwayClientGetPayload<{
    include: {
      migration: {
        include: {
          assigned: true;
          comments: {
            include: {
              user: true;
            };
          };
          bfleet_client: true;
        };
      };
    };
  }>
> {
  const { where } = params;
  return await prisma.wanwayClient.findFirstOrThrow({
    where,
    include: {
      migration: {
        include: {
          assigned: true,
          comments: {
            include: {
              user: true,
            },
          },
          bfleet_client: true,
        },
      },
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

export async function generateUserSummary(data: IWanwayClient) {
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
          "{qnt_device} dispositivos, sendo {qnt_device_online_pctg} ativo e {qnt_device_ofline_pctg} inativos nos últimos meses e";
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
        const excludeParts = [
          " e {qnt_client} clientes",
          "{qnt_client} clientes",
        ];
        const valueToReplace = "";
        excludeParts.map(
          (exclude) => (template = template.replace(exclude, valueToReplace))
        );
        return template;
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
    console.log({ key, value: parameter.value, isValid });
    if (!isValid) {
      const reply = parameter.onError?.(response);
      if (reply) {
        return (response = reply);
      }
    }
    response = response.replace(`{${key}}`, parameter.value!);
  });

  const refineMessage = () => {
    const { qnt_client, qnt_device } = templateParameters;
    const clientIsValid = isValidValue(qnt_client.value);
    const deviceIsValid = isValidValue(qnt_device.value);

    if (!clientIsValid && !deviceIsValid) {
      response = response.replace(
        "e durante todo esse tempo você atingiu os valores de",
        ""
      );
    }
  };

  refineMessage();

  return response;
}
