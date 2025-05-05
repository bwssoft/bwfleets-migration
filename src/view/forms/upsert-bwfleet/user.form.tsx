import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";

export function UserForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuário</CardTitle>
        <CardDescription>
          Dados referentes ao usuário principal desse cliente. Utilizaremos os
          dados abaixo para configurar o acesso dele a plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Nome do usuário" />
          <Input label="E-mail" type="email" />
        </div>
      </CardContent>
    </Card>
  );
}
