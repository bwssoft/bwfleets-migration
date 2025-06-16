'use client';
import React from 'react';
import { useCreateClientBwfleet } from './useCreateClientBwfleet';
import { ContentForm } from './content.form';


export const ClientFleetsForm: React.FC = () => {
  const { form, contactsFieldArray, handleSubmit, errors } = useCreateClientBwfleet();
  
  return (
    <ContentForm
      form={form}
      errors={errors}
      handleSubmit={handleSubmit}
      contactsFieldArray={contactsFieldArray}
    />
  )
}