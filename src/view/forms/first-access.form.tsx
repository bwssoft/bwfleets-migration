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
import { SaveIcon } from "lucide-react";

export function FirstAccessForm() {
  const { form, handleAction } = useFirstAccessFormHandler();

  return (
    <form onSubmit={handleAction} className="w-[25vw]">
      <Card>
        <CardHeader>
          <CardTitle>Antes de prosseguir...</CardTitle>
          <CardDescription>
            A senha atual da sua conta é uma senha de primeiro acesso. Troque
            por uma senha pessoal antes de continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Senha</Label>
            <Input {...form.register("password")} type="password" />
            {form.formState.errors.password && (
              <span className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <Label>Confirmar senha</Label>
            <Input {...form.register("confirmPassword")} type="password" />
            {form.formState.errors.confirmPassword && (
              <span className="text-xs text-destructive">
                {form.formState.errors.confirmPassword.message}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={form.formState.isSubmitting}>
            <SaveIcon />
            Salvar senha e continuar
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
