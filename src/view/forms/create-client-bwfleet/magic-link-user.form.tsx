import { BWFleetsProvider } from "@/@shared/provider/bwfleets"
import { Alert, AlertDescription, AlertTitle } from "@/view/components/ui/alert"
import { Button } from "@/view/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { format, isBefore } from "date-fns"
import { ClipboardIcon } from "lucide-react"
import React from "react"
import { toast } from "sonner"

interface MagicLinkUserFormProps {
	message?: string
	data: {
		uuid?: string
		name: string
		pin?: string
		magicLink: string
		expiresAt?: number
		viewAt?: number
	}
}

const DEFAULT_MESSAGE = (name: string) =>
	`O usuário "${name}" ainda não concluiu a configuração do acesso. Envie as informações abaixo para que ele finalize a configuração e possa acessar a plataforma`

export function MagicLinkUserForm({ message, data }: MagicLinkUserFormProps) {
	const [localMagicLink, setLocalMagicLink] = React.useState<string>(
		data.magicLink
	)
	const [localExpiresAt, setLocalExpiresAt] = React.useState<
		number | undefined
	>(data.expiresAt)

	const viewAt = React.useMemo(() => {
		if (!data.viewAt) return undefined
		return format(new Date(data.viewAt), "dd/MM/yyyy hh:mm")
	}, [data])

	const expiresAt = React.useMemo(() => {
		if (!localExpiresAt) return undefined
		return format(new Date(localExpiresAt), "dd/MM/yyyy hh:mm")
	}, [localExpiresAt])

	const isMagicLinkExpired = React.useMemo(() => {
		if (!localExpiresAt) return false

		return isBefore(new Date(localExpiresAt), new Date())
	}, [localExpiresAt])

	const pin = React.useMemo(() => {
		return data.pin ?? "--"
	}, [data])

	const displayMessage = React.useMemo(() => {
		return message ?? DEFAULT_MESSAGE(data.name)
	}, [data.name, message])

	const service = new BWFleetsProvider()

	const regenerateLinkMutation = useMutation({
		mutationKey: ["regenerate-magic-link", data.uuid],
		mutationFn: () => service.generateMagicLink({ uuid: data.uuid! }),
		onSuccess: (data) => {
			const token = data.data.response.magic_link.token
			const expiresAt = data.data.response.magic_link.expires_at
			const url = `https://bwfleets.com/magic-link?token=${token}`
			setLocalMagicLink(url)
			setLocalExpiresAt(expiresAt)

			navigator.clipboard.writeText(url)
			toast.success(
				"Novo link de acesso gerado e copiado automaticamente com sucesso!"
			)
		},
	})

	function handleCopy(type: "url" | "pin") {
		switch (type) {
			case "url":
				navigator.clipboard.writeText(localMagicLink)
				return toast.success(
					"Link de configuração de acesso copiado com sucesso!"
				)
			case "pin":
				navigator.clipboard.writeText(pin)
				return toast.success("Código PIN de verificação copiado com sucesso!")
			default:
		}
	}

	return (
		<div className="flex flex-col space-y-4 overflow-hidden text-sm">
			<span className="text-muted-foreground">{displayMessage}</span>

			<div className="space-y-2">
				<div className="space-y-1">
					<label className="font-medium">PIN de verificação</label>
					<button
						onClick={() => handleCopy("pin")}
						className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-md border border-border bg-accent p-2 px-3 text-left text-muted-foreground transition-all hover:bg-accent/50"
					>
						<div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
							<span>{pin}</span>
						</div>

						<ClipboardIcon size={16} />
					</button>
				</div>

				<div className="space-y-1">
					<label className="font-medium">Link de acesso</label>

					<button
						onClick={() => handleCopy("url")}
						className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-md border border-border bg-accent p-2 px-3 text-left text-muted-foreground transition-all hover:bg-accent/50"
					>
						<div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
							<span>{localMagicLink}</span>
						</div>

						<ClipboardIcon size={16} />
					</button>
				</div>
				{
					isMagicLinkExpired && (
						<Alert>
							<AlertTitle>
								Link expirado
							</AlertTitle>
							<AlertDescription>
Este link de acesso expirou. Gere um novo link e reenvie ao usuário para que ele conclua a configuração do acesso.
							</AlertDescription>
							<Button
								isLoading={regenerateLinkMutation.isPending}
								onClick={() => regenerateLinkMutation.mutate()}
								variant="outline"
							>
								Gerar novo link
							</Button>
						</Alert>
					)
				}
				{expiresAt && !isMagicLinkExpired && (
					<Alert>
						<AlertTitle>Data de expiração do link</AlertTitle>
						<AlertDescription>Esse link irá expirar {expiresAt}. Gere um novo link para reiniciar a data de expiração.</AlertDescription>
						{data.uuid && (
							<Button
								isLoading={regenerateLinkMutation.isPending}
								onClick={() => regenerateLinkMutation.mutate()}
								variant="outline"
							>
								Gerar novo link
							</Button>
						)}
					</Alert>
				)}
			</div>

			{viewAt && (
				<Alert>
					<AlertTitle>Última data de acesso</AlertTitle>
					<AlertDescription>O usuário chegou a acessar o link no dia ${viewAt}</AlertDescription>
				</Alert>
			)}
		</div>
	)
}
