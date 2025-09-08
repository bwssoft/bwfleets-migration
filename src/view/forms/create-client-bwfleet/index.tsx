'use client';
import React from 'react';
import { useCreateClientBwfleet } from './useCreateClientBwfleet';
import { ContentForm } from './content.form';


export const ClientFleetsForm: React.FC = () => {
  const { form, contactsFieldArray, handleSubmit, errors, handleMagicLinkClose, magicLinkDisclosure } = useCreateClientBwfleet();
  
  return (
    <ContentForm
      form={form}
      errors={errors}
      handleSubmit={handleSubmit}
      contactsFieldArray={contactsFieldArray}
      magicLinkDisclosure={magicLinkDisclosure}
      handleMagicLinkClose={handleMagicLinkClose}
    />
  )
}