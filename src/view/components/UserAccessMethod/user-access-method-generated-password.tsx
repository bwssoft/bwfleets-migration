import { CopyIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface UserAccessMethodGeneratedPasswordProps {
  value?: string;
  error?: string;
  onChange: (password: string) => void;
}

export function UserAccessMethodGeneratedPassword({
  value = "",
  error,
  onChange,
}: UserAccessMethodGeneratedPasswordProps) {
  function handleGenerateChange() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    onChange(password);
  }

  function handleInputOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  function handlePasswordCopy() {
    if (!value) {
      return toast.error("Erro ao copiar senha: Nenhuma senha inserida");
    }

    navigator.clipboard.writeText(value);
    toast.success("Senha copiada com sucesso!");
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inserir senha do usuário</CardTitle>
        <Button variant="outline" size="sm" onClick={handleGenerateChange}>
          <RefreshCwIcon className="h-3 w-3" />
          Gerar nova senha
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Input
            value={value}
            // helper={`Insira uma senha ou clique em "Gerar nova senha" para gerar uma aleatória`}
            error={error}
            onChange={handleInputOnChange}
          />

          <Button onClick={handlePasswordCopy} size="icon" variant="outline">
            <CopyIcon size={16} />
          </Button>
        </div>

        {/* <Alert
          className="mt-8"
          title="Requisitos mínimos"
          subtitle={
            <ul className="space-y-1 text-sm">
              <li
                className={`flex items-center gap-2 ${
                  value.length >= 8 ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {value.length >= 8 ? "✓" : "○"} Mínimo de 8 caracteres
              </li>
              <li
                className={`flex items-center gap-2 ${
                  /[!@#$%^&*(),.?":{}|<>]/.test(value)
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {/[!@#$%^&*(),.?":{}|<>]/.test(value) ? "✓" : "○"} Pelo menos 1
                caractere especial
              </li>
              <li
                className={`flex items-center gap-2 ${
                  /\d/.test(value) ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {/\d/.test(value) ? "✓" : "○"} Pelo menos 1 caractere numérico
              </li>
            </ul>
          }
        /> */}
      </CardContent>
    </Card>
  );
}
