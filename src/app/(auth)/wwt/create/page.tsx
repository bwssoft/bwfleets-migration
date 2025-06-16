import { ClientFleetsForm } from '@/view/forms/create-client-bwfleet';
import React from 'react';


export default async function CreateClientPage() {
  return (
    <div className='flex flex-col w-full p-4'>
      <ClientFleetsForm />
    </div>
  )
}
