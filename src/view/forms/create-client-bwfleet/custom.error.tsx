import React, { useMemo } from 'react';

export type ICustomErrorProps = {
  errors?: Array<string | undefined>;
}

export const CustomError: React.FC<ICustomErrorProps> = ({ errors = [] }) => {
  
  const hidden = useMemo(() => {
    return !(errors.some((error) => !!error));
  }, [errors])

  if(hidden) return null;
  
  return (
    <div className='flex w-full gap-1 text-destructive '>
      {
        errors.map((error, index) => (
          <small key={index}>{error}</small>
        ))
      }
    </div>
  )
}
