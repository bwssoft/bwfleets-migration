import React from 'react';
import { GeneralForm } from './general.form';
import { ContactsForm } from './contacts.form';
import { AddressForm } from './address.form';
import { UserForm } from './user.form';
import { Button } from '@/view/components/ui/button';
import { FieldErrors, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { BWFleetCreateClientFormData } from '../create-client-bwfleet/useCreateClientBwfleet';

export type IContentFormProps = {
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<BWFleetCreateClientFormData>;
  contactsFieldArray: UseFieldArrayReturn<BWFleetCreateClientFormData, 'contacts'>;
  errors: FieldErrors<BWFleetCreateClientFormData>;
}
export const ContentForm: React.FC<IContentFormProps> = ({ contactsFieldArray, form, errors, handleSubmit }) => {
  return (
    <div className='flex flex-col max-h-[10%] h-full overflow-hidden w-full'>
      <div className="flex flex-col max-h-full overflow-y-auto my-4 gap-4">
        <GeneralForm errors={errors} form={form} />
        <ContactsForm form={form} errors={errors} contactsFieldArray={contactsFieldArray} />
        <AddressForm errors={errors} form={form} />
        <UserForm errors={errors} form={form} />
      </div>
      <div className='flex flex-1 min-h-10 w-full '>
        <Button
          className="w-fit"
          disabled={form.formState.isSubmitting}
          onClick={() => handleSubmit()}
          >
          Salvar
        </Button>
      </div>
    </div>
  )
}
