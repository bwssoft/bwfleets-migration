import { Button } from '@/view/components/ui/button';
import React from 'react';

export type IMeetingCancelProps = {
  handleConfirm: () => Promise<void>;
  handleCancel: () => void;
}

export const MeetingCancel: React.FC<IMeetingCancelProps> = ({ handleCancel, handleConfirm }) => {
  return (
    <div className='flex flex-col'>
      <span className='font-medium my-4'>

      Deseja mesmo cancelar essa reunião?
      </span>
      <div className='flex gap-2 mt-2 justify-end'>
        <Button variant={"outline"} onClick={handleCancel} >Cancelar</Button>
        <Button variant={"default"} onClick={handleConfirm} >Confirmar</Button>
      </div>
    </div>
  )
}