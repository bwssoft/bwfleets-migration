"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import React, { useEffect, useMemo, useRef } from "react";
import { CommentCard } from "./@components/comment-card";
import { Button } from "@/view/components/ui/button";
import { Textarea } from "@/view/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { Comment, User } from "@prisma/client";
import EmptyData from "./@components/empty-data";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/@shared/lib/better-auth/auth-client";
import { toast } from "sonner";
import { writeMigrationComment } from "@/@shared/actions/migration.action";

export type IClientCommentsCard = {
  data?: (Comment & { user: User })[];
  hidden?: boolean;
  migration_uuid?: string;
  wwt_account_id: number;
};

const schema = z.object({
  message: z.string().min(1, "Escreva um comentario"),
});

export type IClientCommentsSchema = z.infer<typeof schema>;

export const ClientCommentsCard: React.FC<IClientCommentsCard> = ({
  hidden = false,
  data = [],
  migration_uuid,
  wwt_account_id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  const { register, handleSubmit, reset } = useForm<IClientCommentsSchema>({
    resolver: zodResolver(schema),
  });

  const onHandleSubmit = handleSubmit(async (data) => {
    if (!migration_uuid) {
      throw new Error("Migracao nao iniciada");
    }

    const userUuid = session!.user.id;

    await writeMigrationComment({
      message: data.message,
      user_uuid: userUuid,
      wwt_account_id,
      migration_uuid,
    });

    onHandleReset();
    toast.success("Comentario criado com sucesso");
  });

  const onHandleReset = () => {
    reset({
      message: "",
    });
  };

  const lastIndex = useMemo(() => {
    if (data.length <= 0) return 0;

    return data.length - 1;
  }, [data.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  if (hidden) {
    return null;
  }

  return (
    <Card className="h-[447px] min-h-[447px]">
      <CardHeader>
        <CardTitle>Comentarios da migração</CardTitle>
        <CardDescription>
          Adicione comentarios das etapas de migração do cliente
        </CardDescription>
      </CardHeader>
      <CardContent
        ref={containerRef}
        className="relative flex flex-col w-full h-full max-h-[243px] overflow-y-auto gap-4"
      >
        {data.length <= 0 && <EmptyData />}
        {data.map((comment, index) => (
          <CommentCard
            key={index}
            data={comment}
            divider={index !== lastIndex}
          />
        ))}
      </CardContent>
      <CardFooter>
        <form
          className="flex w-full items-start gap-2"
          onSubmit={onHandleSubmit}
        >
          <Textarea
            {...register("message")}
            placeholder="Escreva um comentario..."
            className="resize-none"
          />
          <Button size="icon" type="submit">
            <SendIcon className="w-5 h-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
