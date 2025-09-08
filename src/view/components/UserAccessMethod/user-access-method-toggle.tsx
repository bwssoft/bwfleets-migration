import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CaptionsOffIcon, LinkIcon, LockIcon } from "lucide-react";
import { ComponentProps } from "react";

type ToggleValues = "manual" | "magic-link" | "none";

interface OnChangeParams {
  value: ToggleValues;
  blocked: boolean;
}

interface UserAccessMethodToggleProps
  extends Omit<ComponentProps<"div">, "onChange"> {
  value?: ToggleValues;
  onChange: (params: OnChangeParams) => void;
}

export function UserAccessMethodToggle({
  value: defaultValue,
  onChange,
  ...rest
}: UserAccessMethodToggleProps) {
  function handleOnChange(value?: ToggleValues) {
    if (value === defaultValue || !value) return;

    const blockedStates = {
      manual: false,
      "magic-link": false,
      none: true,
    };

    onChange({
      value,
      blocked: blockedStates[value],
    });
  }

  return (
    <div {...rest}>
				<ToggleGroup
					value={defaultValue}
					type="single"
					variant="outline"
					className="grid grid-cols-1 w-full gap-2"
					onValueChange={(value) => handleOnChange(value as ToggleValues)}
				>
					<ToggleGroupItem
						value="manual"
						className="flex h-full flex-col items-start p-4 text-left font-normal"
					>
						<label
							htmlFor="manual"
							className="flex items-center gap-2 font-medium"
						>
							<LockIcon className="h-4 w-4" />
							Senha gerada
						</label>
						<p className="text-sm text-muted-foreground">
							Você gera uma senha e envia para o usuário
						</p>
					</ToggleGroupItem>
					<ToggleGroupItem
						value="magic-link"
						className="flex h-full flex-col items-start p-4 text-left font-normal"
					>
						<label
							htmlFor="magic-link"
							className="flex items-center gap-2 font-medium"
						>
							<LinkIcon className="h-4 w-4" />
							Link mágico de convite
						</label>
						<p className="text-sm text-muted-foreground">
							Gera um link de acesso pro usuário configurar uma senha pessoal
						</p>
					</ToggleGroupItem>
					<ToggleGroupItem
						value="none"
						className="flex h-full flex-col items-start p-4 text-left font-normal"
					>
						<label
							htmlFor="none"
							className="flex items-center gap-2 font-medium"
						>
							<CaptionsOffIcon className="h-4 w-4" />
							Sem acesso
						</label>
						<p className="text-sm text-muted-foreground">
							Cria apenas o cadastro do usuário, sem conceder acesso ao sistema.{" "}
						</p>
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
  );
}
