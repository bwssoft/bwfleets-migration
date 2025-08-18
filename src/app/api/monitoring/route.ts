import { findManyClients } from "@/@shared/actions/wwt-client.actions";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const { data } = await findManyClients({
      pageSize: 1000,
      where: {
        parentId: {
          equals: 10160758,
        },
      },
      orderBy: [
        {
          accountStatsBean: {
            deviceTotalNo: "desc",
          },
        },
      ],
    });

    // Transforma os dados em formato adequado para planilha
    const worksheetData = data.map((client) => ({
      Nome: client.accountName,
      DispositivoDaConta: client.accountStatsBean?.deviceNo ?? 0,
      TotalDispositivos: client.accountStatsBean?.deviceTotalNo ?? 0,
      Subclientes: client.isLeaf,
      StatusMigracao: client.migration?.migration_status,
      VendedorAssociado: client.migration?.assigned?.name,
      LinkSistemaMigracao: `https://bwfleets-migration.vercel.app/wwt/clients/${client.accountId}`,
      // adicione outras colunas conforme necessário
    }));

    // Cria a planilha
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

    // Gera o buffer
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="migracao-wwt.xlsx"',
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error?.message });
    }
    return NextResponse.json({ success: false, error: "Erro desconhecido" });
  }
}
