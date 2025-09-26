'use server';
import { BFleetClientEntity, Prisma } from "@prisma/client";
import { parseFormData } from "../utils/parse-form-data";
import { prisma } from "../lib/prisma/prisma-client";
import { cleanObject } from "../utils/clean-object";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export type ICreateBfleetClientEntityParams = Omit<BFleetClientEntity, 'id'>;

export async function createBfleetClientEntity(
  formData: FormData,
  redirectRoute: boolean = true
) {
  const data = parseFormData(formData, true) as ICreateBfleetClientEntityParams;
  const uuid = crypto.randomUUID();

  await prisma.bFleetClientEntity.create({
    data: {
      id: uuid,
      ...data,
      bwfleet: {
        ...data['bwfleet'],
        name: data.bwfleet.name ??data.bwfleet.username
      }
    }
  });

  if(redirectRoute) {
    revalidatePath(`/bwfleets`);
    redirect(`/bwfleets`);
  }
}

interface FindManyBClientsParams {
  page?: number | null;
  pageSize?: number;
  where?: Prisma.BFleetClientEntityWhereInput;
  orderBy?: Prisma.BFleetClientEntityOrderByWithRelationInput[];
}

export async function findBwfleetClientEntity(params: FindManyBClientsParams) {
  const { page, pageSize = 100, where, orderBy } = params;
  const formattedWhere = cleanObject(where);
  const formattedOrderBy = cleanObject(orderBy);

  const skip = !!page ? pageSize * Number(page - 1) : 0;
  const count = await prisma.bFleetClientEntity.count({
    where: formattedWhere,
  });

  const data = await prisma.bFleetClientEntity.findMany({
    skip,
    take: pageSize,
    where: formattedWhere,
    orderBy: formattedOrderBy as Prisma.WanwayClientOrderByWithRelationInput[],
    select: {
      assigned_name: true,
      assigned_uuid: true,
      bwfleet: true,
      id: true,
      Meeting: {
        include: {
          slot: true
        }
      }
    }
  });

  return {
    data,
    count,
  }
}