import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import { MigrationStatus } from '@prisma/client';
import React from 'react';


export const ClientStatusMigrationCard: React.FC = () => {
  
  const options: Array<{ value: MigrationStatus, label: string }> = [
    {
      value: 'TO_DO',
      label: "Pendente"
    },
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status atual</CardTitle>
        <CardDescription>Visualize e informe o status da migração por aqui</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='relative flex w-full'>
        <Select >
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