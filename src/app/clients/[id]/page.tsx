import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { WWTClientTable } from "@/components/table/wwt-client.table";
import {
  ContainedLabelValue,
  ContainedLabelValueItem,
} from "@/components/ui/contained-label-value";
import { WWTClientDevicesStatsTable } from "@/components/table/wwt-client-devices-stats.table";

export default function ClientDetailsPage() {
  return (
    <main className="w-screen h-screen container text-sm">
      <div className="container p-6 pb-12 overflow-y-auto space-y-4">
        <header className="flex flex-col items-start justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/clients">Lista de clientes</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Sergio Ramos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h2 className="text-lg font-bold tracking-tight">
            Detalhes do cliente
          </h2>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Informações do cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <ContainedLabelValue>
              <ContainedLabelValueItem label="Nome" />
              <ContainedLabelValueItem label="Username" />
              <ContainedLabelValueItem label="Email" />
              <ContainedLabelValueItem label="Contato (usuario)" />
              <ContainedLabelValueItem label="Contato (telefone)" />
              <ContainedLabelValueItem label="Endereço" />
              <ContainedLabelValueItem label="Qnt. de subclientes" />
            </ContainedLabelValue>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatisticas de dispositivos</CardTitle>
            <CardDescription>
              Quantidade de dispositivos referentes a este cliente, separados
              por:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WWTClientDevicesStatsTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subclientes</CardTitle>
            <CardDescription>
              Clientes desse clientes encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WWTClientTable data={[]} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </main>
  );
}
