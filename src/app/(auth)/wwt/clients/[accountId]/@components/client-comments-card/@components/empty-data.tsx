import { MessageSquareTextIcon } from 'lucide-react';
import React from 'react';

// import { Container } from './styles';

const EmptyData: React.FC = () => {
  return (
    <div className='flex flex-col gap-1 justify-center items-center w-full h-full'>
        <MessageSquareTextIcon className='w-8 h-8 text-primary' />
        <span className='text-gray-600 text-sm font-medium'>Esse cliente ainda não possui comentarios</span>
        <span className='text-gray-600 text-xs font-medium'>Faça o primeiro comentario</span>
    </div>
  )
}

export default EmptyData;