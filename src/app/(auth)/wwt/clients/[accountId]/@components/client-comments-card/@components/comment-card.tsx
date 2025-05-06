import { formatName, getInitials } from '@/@shared/utils/get-initials';
import { Avatar, AvatarFallback } from '@/view/components/ui/avatar';
import { Comment, User } from '@prisma/client';
import { format } from 'date-fns';
import React from 'react';

export type ICommentCard = {
  divider?: boolean
  data: Comment & {
    user: User
  }
}

export const CommentCard: React.FC<ICommentCard> = ({ data, divider = false }) => {

  const formatTime = () => {
    const formatedData = format(data.createdAt, 'dd-MM-yy HH:mm')
    return formatedData;
  }

  return (
    <div className='flex gap-2 items-center ml-4'>
      
      <div className='container relative flex flex-col gap-1'>
        {
          divider && (
            <div id='divider' className='absolute -left-4 -bottom-1 w-[2px] ml-[3px] -my-[18px] h-full bg-gray-300 rounded-md' />
          )
        }
          
        <div className='relative flex gap-2 items-center'>
          <div id='dot' className='absolute -left-4 bg-gray-300 @ w-2 h-2 rounded-full' />
          <Avatar className='w-7 h-7'>
            <AvatarFallback className='text-xs'>{getInitials(data.user.name)}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className="text-xs font-semibold">
              {formatName(data.user.name)}
            </span>
            <span className='text-[9px] text-gray-500 font-semibold'>
              {formatTime()}
            </span>
          </div>
        </div>

        <div className='text-xs ml-4 max-w-[320px] '>
          {data.message}
        </div>
      </div>

    </div>
  )
}