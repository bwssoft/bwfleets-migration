"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Label } from "@/view/components/ui/label";
import { Input } from "@/view/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/view/components/ui/select";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { SaveIcon, XIcon } from "lucide-react";
import { useCreateUserFormHandler } from "./create-user.handler";
import { Controller } from "react-hook-form";

export function CreateUserForm() {
  const { form, handleAction } = useCreateUserFormHandler();

  return (
    <form action={handleAction}>
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar usuário</CardTitle>
          <CardDescription>
            Preencha as informações abaixo para cadastrar um novo usuário no
            sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input {...form.register("name")} />
          </div>
          <div className="space-y-1">
            <Label>E-mail</Label>
            <Input {...form.register("email")} />
          </div>

          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <div className="space-y-1">
                <Label>Permissão</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Comercial</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </CardContent>
        <CardFooter className="gap-2 justify-end">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/users">
              <XIcon /> Cancelar
            </Link>
          </Button>
          <Button type="submit">
            <SaveIcon /> Efetuar cadastro
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
