'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/view/components/ui/card';
import React, { useEffect, useMemo, useRef } from 'react';
import { CommentCard } from './@components/comment-card';
import { Button } from '@/view/components/ui/button';
import { Textarea } from '@/view/components/ui/textarea';
import { SendIcon } from 'lucide-react';
import { Comment } from '@prisma/client';

export type IClientCommentsCard = {
  data?: Comment[]
  hidden?: boolean
}

export const ClientCommentsCard: React.FC<IClientCommentsCard> = ({ hidden = false, data = [] }) => {

  const containerRef = useRef<HTMLDivElement>(null)

  const lastIndex = useMemo(() => {
    if(data.length <= 0) return 0;

    return data.length - 1;
  }, [data.length]) 

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [])

  if(hidden) {
    return null
  }

  return (
    <Card className="h-[447px] min-h-[447px]">
      <CardHeader>
        <CardTitle>Comentarios da migração</CardTitle>
        <CardDescription>Adicione comentarios das etapas de migração do cliente</CardDescription>
      </CardHeader>
      <CardContent ref={containerRef} className="relative flex flex-col w-full h-full max-h-[243px] overflow-y-auto gap-4">
        
          {/* {
            data.length <= 0 && (
              <EmptyData />
            )
          } */}
          {
            data.map((comment, index) => (
              <CommentCard key={index} divider={index !== lastIndex} />
            ))
          }
          <CommentCard  divider />
          <CommentCard  divider />
          <CommentCard  />
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-center gap-2'>
          <Textarea placeholder='Hã do oruam' className='resize-none' />
          <Button>
            <SendIcon className='w-5 h-5' />
          </Button>
        </div>
        
      </CardFooter>
    </Card>
  )
}
