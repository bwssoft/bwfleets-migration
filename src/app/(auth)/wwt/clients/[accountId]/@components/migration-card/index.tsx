'use client'

import { useDisclosure } from '@/@shared/hooks/use-disclosure';
import { BWFleetsProvider } from '@/@shared/provider/bwfleets';
import { Spinner } from '@/view/components/ui';
import { Button } from '@/view/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/view/components/ui/dialog';
import MigrationProcessForm from '@/view/tables/@components/migration-process';
import { MigrationAccessToken, MigrationStatus } from '@prisma/client';
import { differenceInHours } from 'date-fns';
import { ClipboardIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export type IMigrationCardType = {
  status?: MigrationStatus | null
  migration_token?: MigrationAccessToken | null
  id?: string
  account_id?: number
}

export const MigrationCard: React.FC<IMigrationCardType> = ({ migration_token, status, id, account_id }) => {

  const allowedStatus: MigrationStatus[] = ['DONE', 'SUCCESS'];
  const [pedingToken, setPedingToken] = useState<boolean>(true);
  const [currentToken, setCurrentToken] = useState<MigrationAccessToken | undefined>(migration_token ?? undefined);
  const bWFleetsProvider = new BWFleetsProvider();
  const migrationDisclousure = useDisclosure();
  const router = useRouter();
  

  const cardTitle = useMemo(() => {
    if(status === 'DONE') return 'Migrar dados'
    if(status === 'SUCCESS' && migration_token?.completed === true) return 'Cliente Atualizado'
    if(status === 'SUCCESS') return 'Gerar link de acesso'
  }, [status])

  const cardDescription = useMemo(() => {
    if(status === 'DONE') return 'Inicie o processo de migração dos dados para a BWFleets'
    if(status === 'SUCCESS' && migration_token?.completed === true) return 'O Cliente concluiu o processo de migração da plataforma com sucesso'
    if(status === 'SUCCESS') return 'Gere o link de primeiro acesso a plataforma para o cliente'
  }, [status])

  const handleGenLink = async (data: MigrationAccessToken, id: string) => {
      setPedingToken(true)
      setCurrentToken(data)
      try {
        const { created_at, bfleet_uuid, completed } = data
        const diffHours = differenceInHours(new Date(), created_at)
        if(diffHours >= 7 && completed !== true) {
          const replyToken = await bWFleetsProvider.generateAccessLink({
            query: { uuid: bfleet_uuid }
          })
          const { ttoken } = replyToken.response
          const body = {
            token: ttoken,
            uuid: id,
            bfleet_uuid
          }
          
          await fetch('/api/migration/finish', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            }
          })
  
          setCurrentToken({
            ...data,
            created_at: new Date(),
            token: ttoken
          })
        }
      }
      finally {
        setPedingToken(false)
      }
  }

  useEffect(() =>{
    if(migration_token && id) {
      handleGenLink(migration_token, id)
    }
  },[])

  const getAccessLink = useCallback((token?: string | null) => {
      const url = `https://bwfleets.com/welcome?token=${token}`;
      return url;
    }, [])
  
    const handleURLCopy = (url: string | undefined) => {
      if (!url) return
  
      navigator.clipboard.writeText(url)
      toast.success("Link de acesso copiado com sucesso!")
    }

  const AcessLinkContent = () => {
    if(pedingToken && migration_token?.completed === false) {
      return (
        <div className='flex flex-col text-sm text-center gap-1 text-muted-foreground w-full h-full justify-center items-center'>
          Aguarde enquanto o link de acesso é gerado. Isso pode levar alguns segundos.
          <div className='flex items-center justify-center'>
            <Spinner className='w-8 h-8 text-muted' />
          </div>
        </div>
      )
    }

    return (
      <div className="mt-3 flex flex-col space-y-2 overflow-hidden">
        {
          migration_token?.completed === true ? (
           
            <Button className='cursor-auto' variant={'secondary'} >Migração Concluída</Button>

          ) : (
             <button
              onClick={() => handleURLCopy(getAccessLink(currentToken?.token))}
              className="flex items-center cursor-pointer justify-between gap-4 rounded-md border border-border bg-accent p-2 px-3 text-left text-muted-foreground transition-all hover:bg-accent/50"
            >
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                <span>{getAccessLink(currentToken?.token) ?? "--"}</span>
              </div>

              <ClipboardIcon className="h-4 w-4" />
            </button>
          )
        }
        
      </div>
    )
  }

  const onInternalClose = () => {
    migrationDisclousure.onClose()
    router.refresh()
  }

  const MigrationProcess = () => {
    return (
      <React.Fragment>
        <Button onClick={migrationDisclousure.onOpen} >
          Migrar dados
        </Button>
        <Dialog
          open={migrationDisclousure.isOpen}
          onOpenChange={migrationDisclousure.onClose}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Processo de migração</DialogTitle>
              <DialogDescription>
                Aguarde as etapas serem finalizadas
              </DialogDescription>
            </DialogHeader>
            <MigrationProcessForm onClose={onInternalClose} id={id}   accountId={account_id} />
          </DialogContent>
        </Dialog>
      </React.Fragment>
    )
  } 

  if(!status || !allowedStatus.includes(status)) {
    return null
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {
         status === 'SUCCESS' ?  <AcessLinkContent /> : <MigrationProcess />
          
        }
        
      </CardContent>
    </Card>
  )
}
