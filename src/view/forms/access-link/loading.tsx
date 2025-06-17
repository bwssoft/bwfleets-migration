import { Spinner } from '@/view/components/ui';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/view/components/ui/dialog';
import React from 'react';

const LoadingAcessLink: React.FC = () => {
  return (
    <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerando o link</DialogTitle>
          <DialogDescription>
            Aguarde enquanto o link de acesso é gerado. Isso pode levar alguns segundos.
            <div className='flex items-center justify-center'>
              <Spinner className='w-8 h-8 text-muted' />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
  )
}

export default LoadingAcessLink;