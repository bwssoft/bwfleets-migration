import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/view/components/ui/accordion"
import { Button } from "@/view/components/ui/button"
import { AlertCircle, CheckCircle, Circle, ClipboardIcon, Loader2 } from "lucide-react"
import React, { useCallback, useRef, useState } from "react"
import { MigrationProcessError } from "./errors/migration-process.error"
import { IBFleetClient } from "@/@shared/interfaces"
import { schema as ClientSchema } from "@/view/forms/create-client-bwfleet/useCreateClientBwfleet"
import { ClientSchemaMapper } from "./data-mapper/client-schema.mapper"
import { useRouter } from "next/navigation"
import { BWFleetsProvider } from "@/@shared/provider/bwfleets"
import { ClientBfleetsMapper } from "./data-mapper/client-bfleets.mapper"
import { toast } from "sonner"
import { UserBfleetsMapper } from "./data-mapper/user-bfleets.mapper"
import { addDays } from "date-fns"

type StepStatus = "pending" | "active" | "completed" | "error"

interface Step {
  id: string
  title: string
  description: string
  status: StepStatus
  errors?: Array<string>
  expand?: boolean
}

interface IHandleUpdateBase {
  step: Partial<Step>
}

interface IHandleReplaceSteps extends IHandleUpdateBase {
  replace: true
}

interface IHandleUpdateStep extends IHandleUpdateBase {
  replace?: false
  id: string
}

export type IHandleUpdateParams = IHandleReplaceSteps | IHandleUpdateStep;

interface IExecuteFunctionStep {
  fnStep?: StepFunction;
  onError?: () => void;
  step: Step
}

interface IHandleFetchData { success: boolean, data: IBFleetClient }

type StepID = string
type StepFunction = (() => void) | (() => Promise<void>);

export default function MigrationProcess({ accountId, onClose, id }: { accountId: number | undefined, onClose: () => void; id?: string }) {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "search",
      title: "Buscando dados",
      description: "Buscando dados corrigidos para migração",
      status: "pending",
    },
    {
      id: "error-checking",
      title: "Verificando erros",
      description: "Verificação de possíveis erros e conflitos",
      status: "pending",
    },
    {
      id: "submission",
      title: "Enviando dados",
      description: "Envio de dados para o servidor",
      status: "pending",
    },
    {
      id: 'finish',
      title: "Gerando link de acesso",
      description: "Finalizando o processo e gerando link de acesso",
      status: 'pending'
    }
  ])
  const [accordionValue, setAccordionValue] = useState<Array<string>>([]);
  const router = useRouter();
  const bWFleetsProvider = new BWFleetsProvider();
  const clientRef = useRef<IBFleetClient | undefined>(undefined);
  const tokenRef = useRef<{ token: string | undefined }>(undefined);

  const handleShowAcessToken = async (token: string) => {
    tokenRef.current = { token };
    setAccordionValue((prev) => Array.from(new Set([...prev, 'finish'])))
  } 

  const handleFetchData = async () => {
    const response = await fetch(`/api/bfleet-client/find-one?accountId=${accountId}`, {
      method: 'GET',
    })


    const { data, success } = await response.json() as IHandleFetchData;

    if(success === false) {
      throw new MigrationProcessError([
        "Falha ao buscar dados"
      ])
    }

    return data
  }

  const getAccessLink = useCallback(() => {
    const url = `https://bwfleets.com/welcome?token=${tokenRef.current?.token}`;
    return url;
  }, [tokenRef.current])


  const handleURLCopy = (url: string | undefined) => {
		if (!url) return

		navigator.clipboard.writeText(url)
		toast.success("Link de acesso copiado com sucesso!")
	}

  const handleStepSearch = async () => {
    const data = await handleFetchData()
    clientRef.current = data;
  }

  const handleStepErrorChecking = async () => {
    const client = clientRef.current;
    if(!client) {
      throw new MigrationProcessError([
        "Falha ao ler dados do cliente"
      ])
    }
    const clientFormat = ClientSchemaMapper.formater(client);
    const response = await ClientSchema.safeParseAsync(clientFormat);
    if(!response.success) {
      const errors = response.error.errors.map(({ message }) => message)
      throw new MigrationProcessError(errors)
    }
  }

  const handleStepFinishProcess = async () => {
    try {
      const clientReply = await bWFleetsProvider.findOneClient({
          query: {
            ww_account_id: accountId?.toString()
          }
      })
      if(!clientReply.ok) {
        throw new MigrationProcessError([
          "Falha ao finalizar migração"
        ])
      }

      const clientEntity = clientReply.response.data;
      const accessLinkReply = await bWFleetsProvider.generateAccessLink({
        query: { uuid: clientEntity.uuid }
      })
      const { ttoken } =  accessLinkReply.response;

      const body = {
        token: ttoken,
        uuid: id,
        bfleet_uuid: clientEntity.uuid
      }
      
      await fetch('/api/migration/finish', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        }
      })

      handleShowAcessToken(ttoken)
    }
    catch {
      throw new MigrationProcessError([
        "Falha ao gerar link de acesso"
      ])
    }
  }

  const handleStepSubmission = async () => {
    try {
      const clientEntity = ClientBfleetsMapper.fomater(clientRef.current!);
      await bWFleetsProvider.updateOneClient({
        query: {
          ww_account_id: accountId?.toString()
        },
        value: {
          ...clientEntity,
          validate: {
            date: addDays(new Date(), 90),
            days: 90
          }
        }
      })
      const client = await bWFleetsProvider.findOneClient({
        query: {
          ww_account_id: accountId?.toString()
        }
      })


      if(client.response.data.user_uuid) {
        const userEntity = UserBfleetsMapper.formatter(clientRef.current?.user)

        await bWFleetsProvider.updateOneUser({
          query: {
            uuid: client.response.data.user_uuid
          },
          value: userEntity
        })
      }
      
    }
    catch {
      throw new MigrationProcessError([
        "Ocorreu um erro, tente novamente mais tarde"
      ])
    }
  }

  const libraryFunctions: Record<StepID, StepFunction> = {
    "search": handleStepSearch,
    "error-checking": handleStepErrorChecking,
    "submission": handleStepSubmission,
    "finish": handleStepFinishProcess
  }

  const getStepFunction = (params: { stepId: StepID }) => {
    const { stepId } = params;
    return libraryFunctions[stepId];
  }

  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpdateStep = (params: IHandleUpdateParams) => {
    const { replace, step: data } = params;

    if(replace) {
      setSteps((prev) => prev.map((step) => ({ ...step, ...data })))
      return
    }

    const { id } = params;

    setSteps((prev) => {
      return prev.map((step) => 
        step.id === id ? { ...step, ...data } : step
      );
    });
  }

  const handleResetProcess = () => {
    handleUpdateStep({
      replace: true,
      step: {
        status: 'pending',
        errors: []
      }
    })
  }

  const waitTime = async (ms: number = 500) => {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  const handleChangeStatus = ({ status, step, errors }: {step: Step, status: StepStatus, errors?: Array<string> }) => {
    const { id } = step;
    handleUpdateStep({
      id,
      step: { status, errors }
    })
    waitTime()
  }

  const executeFunctionStep = async (params: IExecuteFunctionStep): Promise<{ success: boolean }> => {
    const { fnStep, step, onError } = params;
    try {
      handleChangeStatus({
        step,
        status: 'active'
      })
      await waitTime(2000)
      if(fnStep) {
        await fnStep()
      }
      handleChangeStatus({
        step,
        status: 'completed'
      })
      return {
        success: true
      }
    }
    catch (error) {
      if(error instanceof MigrationProcessError) {
        const { errors } = error;
        handleChangeStatus({
          step,
          status: 'error',
          errors
        })
      }
      
      if(onError) {
        onError()
      }

      return {
        success: false
      }
    }
  }

  const executeSteps = async () => {
    try {
      handleResetProcess()
      setIsProcessing(true)
      
      for (const step of steps) {
        const stepFunction = getStepFunction({ stepId: step.id })
        
        const response = await executeFunctionStep({
          step,
          fnStep: stepFunction,
        })

        if(!response.success) {
          return
        }
      }
    }
    finally {
      setIsProcessing(false)
      // toast.success("Migração concluída com sucesso!")
      // onClose()
    }
  }


  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case "pending":
        return <Circle className="h-5 w-5 text-muted-foreground" />
      case "active":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStepTextColor = (status: StepStatus) => {
    switch (status) {
      case "active":
        return "text-blue-600"
      case "completed":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const allCompleted = steps.every((step) => step.status === "completed")
  const hasErrors = steps.some((step) => step.status === "error" && step.id !== 'submission')

  function handleRedirect() {
    onClose()
    router.push(`/wwt/clients/${accountId}`);
  }

  return (
    <React.Fragment>
      <div className="py-4 w-full max-w-full overflow-hidden">
          <Accordion type="multiple" value={accordionValue} onValueChange={setAccordionValue} className="w-full">
            {steps.map((step) => (
              <AccordionItem key={step.id} value={step.id} className="border-b">
                <AccordionTrigger className="hover:no-underline cursor-pointer py-3">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex-shrink-0">{getStepIcon(step.status)}</div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${getStepTextColor(step.status)}`}>{step.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                    </div>
                    {step.status === "active" && (
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                      </div>
                    )}
                    {step.errors && step.errors.length > 0 && (
                      <div className="flex-shrink-0">
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          {step.errors.length} erro{step.errors.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent  className="pb-3">
                  
                  {
                    step.id === 'finish' && step.status === "completed" && !step.errors && (
                      <button
                        onClick={() => handleURLCopy(getAccessLink())}
                        className="flex items-center cursor-pointer my-2 justify-between w-full gap-4 rounded-md border border-border bg-accent p-2 px-3 text-left text-muted-foreground transition-all hover:bg-accent/50"
                      >
                        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          <span>{getAccessLink() ?? "--"}</span>
                        </div>

                        <ClipboardIcon className="h-4 w-4" />
                      </button>
                    )
                  }
                  {step.status === "completed" && !step.errors && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                      ✓ Etapa concluída com sucesso
                    </div>
                  )}
                  
                  {step.errors && step.errors.length > 0 && (
                    <div className="space-y-2 ">
                      <div className="text-sm font-medium  text-red-600">Errors encontrados:</div>
                      <ul className="space-y-1 bg-red-50 list-disc   border-l-2 p-2 border-red-200 rounded">
                        {step.errors.map((error, errorIndex) => (
                          <li
                            key={errorIndex}
                            className="text-xs ml-2 text-destructive truncate max-w-full overflow-hidden text-ellipsis"
                          >
                            {`- ${error}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {step.status === "active" && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">🔄 Processando no momento...</div>
                  )}
                  {step.status === "pending" && (
                    <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                      ⏳ Aguardando...
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs break-words max-w-[60%] text-muted-foreground">
            {allCompleted
              ? "Processo concluído com sucesso!"
              : hasErrors
                ? "Foram encontrado erros. Expanda a etapa para ver mais detalhes."
                : isProcessing
                  ? "Processando..."
                  : "Aguardando Inicio"}
          </div>
          <div className="flex space-x-2">
            {!isProcessing && !hasErrors && !allCompleted && (
              <Button onClick={executeSteps} >
                Iniciar
              </Button>
            )}
            {
              !isProcessing && hasErrors && (
                <Button onClick={handleRedirect}>
                  Corrigir
                </Button>
              )
            }
            {!isProcessing && (
              <Button onClick={onClose} >
                Fechar
              </Button>
            )}
          </div>
        </div>
    </React.Fragment>
  )
}