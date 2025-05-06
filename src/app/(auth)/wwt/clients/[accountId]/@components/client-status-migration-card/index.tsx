'use client'

import { updateMigrationStatus } from '@/@shared/actions/wwt-client.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import { MigrationStatus } from '@prisma/client';
import React from 'react';
import { toast } from 'sonner';

export interface IClientStatusMigrationCard {
  status: MigrationStatus | null
  id: string
  hidden?: boolean
}

export const ClientStatusMigrationCard: React.FC<IClientStatusMigrationCard> = ({ status, id, hidden = false }) => {
  
  const options: Array<{ value: MigrationStatus, label: string }> = [
    {
      value: 'PENDING',
      label: "Em Andamento"      
    },
    {
      value: 'WAITING',
      label: "Aguardando resposta"
    },
    {
      value: 'FAILED_BY_CLIENT',
      label: "Cliente recuso a migração"
    },
    {
      value: 'FAILED_BY_CONTACT',
      label: 'Não conseguiu contato'
    }
  ]

  const onHandleChange = async (value: string) => {
    const formData = new FormData();
    formData.append("uuid", id);
    formData.append("status", value);

    await updateMigrationStatus(formData);

    toast.success("Status atualizado com sucesso")
  }

  if(hidden) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status atual</CardTitle>
        <CardDescription>Visualize e informe o status da migração por aqui</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='relative flex flex-col gap-1 w-full'>
        <Select defaultValue={status ?? undefined} onValueChange={onHandleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {
              options.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        </div>
      </CardContent>
    </Card>
  )
}