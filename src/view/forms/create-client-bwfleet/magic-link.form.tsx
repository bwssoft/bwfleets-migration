import { Alert, AlertDescription, AlertTitle } from "@/view/components/ui/alert"
import { Button } from "@/view/components/ui/button"
import React from "react"
import { MagicLinkUserForm } from "./magic-link-user.form"

interface UpsertClientMagicLinkFormProps {
	data: {
		magicLink: string
		pin: string
		name: string
	}
	onRequestClose: () => void
}

export function UpsertClientMagicLinkForm({
	data,
	onRequestClose,
}: UpsertClientMagicLinkFormProps) {
	return (
		<div className="flex flex-col w-full max-w-full gap-4 h-full">
				<MagicLinkUserForm
					message="Usuário criado com sucesso! Envie as informações abaixo ao responsável para que ele finalize a configuração de acesso à plataforma."
					data={data}
				/>

				<Alert>
					<AlertTitle>Sobre o magic link</AlertTitle>
					<AlertDescription>É possível conferir essas informações novamente na ação "Informações sobre o link de acesso" do botão direito na tabela de Acessos.</AlertDescription>
				</Alert>
				<Button onClick={onRequestClose}>Confirmar e fechar</Button>
		</div>
	)
}
