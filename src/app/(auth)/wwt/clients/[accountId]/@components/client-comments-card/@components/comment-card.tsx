import { formatName } from '@/@shared/utils/get-initials';
import { Avatar, AvatarFallback } from '@/view/components/ui/avatar';
import React from 'react';

export type ICommentCard = {
  divider?: boolean
}

export const CommentCard: React.FC<ICommentCard> = ({ divider = false }) => {
  return (
    <div className='flex gap-2 items-center ml-4'>
      
      <div className='container relative flex flex-col gap-1'>
        {
          divider && (
            <div id='divider' className='absolute -left-4 -bottom-1 w-[2px] ml-[3px] -my-2 h-[85%] bg-gray-300 rounded-md' />
          )
        }
          
        <div className='relative flex gap-2 items-center'>
          <div id='dot' className='absolute -left-4 bg-gray-300 @ w-2 h-2 rounded-full' />
          <Avatar className='w-7 h-7'>
            <AvatarFallback className='text-xs'>IS</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className="text-xs font-semibold">
              {formatName("italo souza")}
            </span>
            <span className='text-[9px] text-gray-500 font-semibold'>
              06/05/25 12:43
            </span>
          </div>
        </div>

        <div className='text-xs ml-4 max-w-[320px] '>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt officia deserunt, corporis non exercitationem cumque quasi. Atque animi ducimus perferendis. Ad nulla esse in fuga quam officiis quo, aliquam repellendus!
        </div>
      </div>

    </div>
  )
}