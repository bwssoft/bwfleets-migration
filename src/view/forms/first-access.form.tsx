"use client";

import { Button } from "@/view/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { Label } from "@/view/components/ui/label";
import { useFirstAccessFormHandler } from "./first-access.handler";

export function FirstAccessForm() {
  const { form, handleAction } = useFirstAccessFormHandler();

  return (
    <form action={handleAction}>
      <Card>
        <CardHeader>
          <CardTitle>Antes de prosseguir...</CardTitle>
          <CardDescription>
            A senha atual da sua conta é uma senha de primeiro acesso. Troque
            por uma senha pessoal antes de continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Label>Senha</Label>
            <Input {...form.register("password")} type="password" />
          </div>
          <div className="space-y-1">
            <Label>Confirmar senha</Label>
            <Input {...form.register("confirmPassword")} type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Salvar senha</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
