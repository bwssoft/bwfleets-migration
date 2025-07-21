/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { WanwayClient, Prisma } from "@prisma/client";
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
      Meeting: {
        include: {
          slot: true,
          account: true,
          organizer: true,
          client: true,
        }
      }
      migration: {
        include: {
          assigned: true;
          comments: {
            include: {
              user: true;
            };
          };
          bfleet_client: {
            include: {
              user: true
            }
          };
        };
      };
    };
  }>
> {
  const { where } = params;
  console.log({ where })
  return await prisma.wanwayClient.findFirstOrThrow({
    where,
    include: {
      Meeting: {
        include: {
          slot: true,
          account: true,
          organizer: true,
          client: true,
        }
      },
      migration: {
        include: {
          assigned: true,
          comments: {
            include: {
              user: true,
            },
          },
          bfleet_client: {
            include: {
              user: true
            }
          },
        },
      },
    },
  });
}

export type ITemplateParameters =
  | "client_name"
  | "time"
  | "qnt_all_device"
  | "qnt_device"
  | "qnt_device_online_pctg"
  | "qnt_device_ofline_pctg"
  | "qnt_client";
export type IParametersValue = {
  value?: string;
  onError?: (template: string) => string | void;
};

export type ICustomTree = {
  accountId: number;
    accountStatsBean: {
        accountId: number;
        deviceNo: number;
        deviceTotalNo: number;
        offlineDeviceNo: number;
        onlineDeviceNo: number;
        success: boolean;
        unUsedDeviceNo: number;
    };
    isLeaf: number;
}

export async function generateUserSummary(data: IWanwayClient) {

  const findSubClients = async (accountId: number) => {
    const subClients = await prisma.wanwayClient.findMany({
      where: {
        parentId: {
          equals: accountId
        }
      },
      select: {
        accountStatsBean: true,
        isLeaf: true,
        accountId: true,
      },
    })

    return subClients;
  }

  const getRecursiveTree = async (data: Partial<WanwayClient>) : Promise<Array<ICustomTree>> => {
    const hasSubClient = (data.isLeaf ?? 0 )> 0;

    if(!hasSubClient) return []

    const response = await findSubClients(data.accountId!);

    for (const client of response) {
      const subClients = await getRecursiveTree(client);
      response.push(...subClients)
    }

    return response;
  }

  const allClients = await getRecursiveTree(data);

  const { offline, online, quantity } = allClients.reduce((acc, value) => {
    const { accountStatsBean: { onlineDeviceNo, offlineDeviceNo, unUsedDeviceNo, deviceNo } } = value;
    acc['online'] += onlineDeviceNo
    acc['offline'] += offlineDeviceNo + unUsedDeviceNo;
    acc['quantity'] += deviceNo;
    return acc;
  }, { online: 0, offline: 0, quantity: 0 })

  const TEMPLATE_MESSAGE =
    "Olá, {client_name}. Tudo bem? Você está com a gente desde {time} e durante todo esse tempo você atingiu o volume de {qnt_client} clientes, e {qnt_all_device} dispositivos, sendo {qnt_device} na sua própria conta. Dentro desses, {qnt_device_online_pctg} estão ativos e {qnt_device_ofline_pctg} estão inativos nos últimos meses.";

    

  const formatTime = (value?: number): string | undefined => {
    if (!value) return;

    return format(value, "dd/MM/yyyy");
  };

  const calcPercentage = (value: number, total: number) => {
    const response = (value * 100) / total;
    const arrounded = Math.round(response);

    if(arrounded === 0 && response > 0 ) return 1

    if(arrounded > 100) return 100

    return arrounded
  };

  const calculateDeviceStatistics = () => {
    const { offlineDeviceNo, onlineDeviceNo, unUsedDeviceNo, deviceNo } =
      data.accountStatsBean;
    const offlineQuantity = offlineDeviceNo + unUsedDeviceNo + offline
    const deviceTotalNo = deviceNo + quantity;
    const oflinePercentage = calcPercentage(
      offlineQuantity,
      deviceTotalNo 
    );
    const onlineQuantity = onlineDeviceNo + online;
    const onlinePercentage = calcPercentage(onlineQuantity, deviceTotalNo);

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
    qnt_all_device: {
      value: data.accountStatsBean.deviceTotalNo?.toString(),
      onError: (template: string) => {
        const excludeDevice = "{qnt_all_device} dispositivos, sendo {qnt_device} na sua própria conta. Dentro desses, {qnt_device_online_pctg} estão ativos e {qnt_device_ofline_pctg} estão inativos nos últimos meses."
        const valueToReplace = "";
        return template.replace(excludeDevice, valueToReplace);
      },
    },
    qnt_device: {
      value: data.accountStatsBean.deviceNo?.toString() === data.accountStatsBean.deviceTotalNo.toString() ? "todos" : data.accountStatsBean.deviceNo?.toString(),
      onError: (template: string) => {
        const excludeDevice =
          ", sendo {qnt_device} na sua própria conta";
        const valueToReplace = "";
        return template.replace(excludeDevice, valueToReplace);
      },
    },
    qnt_device_online_pctg: {
      value: onlinePercentage ? `${onlinePercentage}%` : undefined,
      onError: (template: string) => {
        const exclude = "{qnt_device_online_pctg} estão ativos e";
        const valueToReplace = "";
        return template.replace(exclude, valueToReplace);
      },
    },
    qnt_device_ofline_pctg: {
      value: oflinePercentage ? `${oflinePercentage}%` : undefined,
      onError: (template: string) => {
        const excludeParts = [
          "e {qnt_device_ofline_pctg} estão inativos nos últimos meses.",
          " e {qnt_device_ofline_pctg} estão inativos nos últimos meses.",
          "{qnt_device_ofline_pctg} estão inativos nos últimos meses."
        ]
        const valueToReplace = "";
        excludeParts.map(
          (exclude) => (template = template.replace(exclude, valueToReplace))
        );
        return valueToReplace
      },
    },
    qnt_client: {
      value: data.isLeaf.toString(),
      onError: (template: string) => {
        const excludeParts = [
          "{qnt_client} clientes, e",
          " {qnt_client} clientes, e",
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
    if (!isValid) {
      const reply = parameter.onError?.(response);
      if (reply) {
        return (response = reply);
      }
    }
    response = response.replace(`{${key}}`, parameter.value!);
  });

  const refineMessage = () => {
    const { qnt_client, qnt_all_device } = templateParameters;
    const clientIsValid = isValidValue(qnt_client.value);
    const deviceIsValid = isValidValue(qnt_all_device.value);

    if (!clientIsValid && !deviceIsValid) {
      response = response.replace(
        "{qnt_client} clientes, e",
        " {qnt_client} clientes, e"
      );
      response = response.replace(
        " e durante todo esse tempo você atingiu o volume de",
        "."
      )
    }
  };

  refineMessage();

  return response;
}
