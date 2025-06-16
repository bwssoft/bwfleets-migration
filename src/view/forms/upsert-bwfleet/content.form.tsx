import React from 'react';
import { GeneralForm } from './general.form';
import { ContactsForm } from './contacts.form';
import { AddressForm } from './address.form';
import { UserForm } from './user.form';
import { Button } from '@/view/components/ui/button';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { BWFleetUpsertClientFormData } from './upsert-bwfleet.handler';

export type IContentFormProps = {
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<BWFleetUpsertClientFormData>;
  contactsFieldArray: UseFieldArrayReturn<BWFleetUpsertClientFormData, 'contacts'>; 
}
export const ContentForm: React.FC<IContentFormProps> = ({ contactsFieldArray, form, handleSubmit }) => {
  return (
    <React.Fragment>
      <div className="flex flex-col my-4 gap-4">
        <GeneralForm form={form} />
        <ContactsForm form={form} contactsFieldArray={contactsFieldArray} />
        <AddressForm form={form} />
        <UserForm form={form} />
      </div>
      <Button
        className="w-fit"
        disabled={form.formState.isSubmitting}
        onClick={() => handleSubmit()}
        >
        Salvar
      </Button>
    </React.Fragment>
  )
}
