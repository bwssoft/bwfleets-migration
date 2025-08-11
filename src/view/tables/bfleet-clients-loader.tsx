import React from 'react';
import { BFleetClientsTable } from './bfleet-clients.table';
import { findBwfleetClientEntity } from '@/@shared/actions/bwfleet-client-entity.actions';
import { IBFleetClientsPageParams } from '@/app/(auth)/bwfleets/params';


export interface BFleetClientsTableLoaderProps {
  params: IBFleetClientsPageParams;
}

export async function BFleetClientsLoader({ params }: BFleetClientsTableLoaderProps) {
  const { count, data } = await findBwfleetClientEntity({
    page: params.page,
    where: {
      bwfleet: {
        is: {
          name: {
            contains: params?.name as string,
            mode: 'insensitive',
          },
          email: {
            contains: params?.email as string,
            mode: 'insensitive',
          }
        }
      }
    },
    orderBy: [
      {
        bwfleet: {
          name: params.nameOrderBy !== 'none' ? (params.nameOrderBy as never) : undefined,
        }
      }
    ]
  })
  
  return (
    <BFleetClientsTable 
      data={data}
      pagination={{
        count,
        pageSize: 20,
      }}
    />
  )
}