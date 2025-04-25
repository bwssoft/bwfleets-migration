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
import React from "react";
import { useLoginFormHandler } from "./login.handler";

export function LoginForm() {
  const { form, handleAction } = useLoginFormHandler();

  return (
    <React.Fragment>
      <form onSubmit={handleAction}>
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Efetue o login para continuar</CardDescription>
          </CardHeader>
          <CardContent className="my-2 space-y-4">
            <div className="flex flex-col gap-1">
              <Label>E-mail</Label>
              <Input {...form.register("email")} type="email" />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Senha</Label>
              <Input {...form.register("password")} type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              isLoading={form.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
              Entrar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </React.Fragment>
  );
}
