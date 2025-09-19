import { IScheduleSlot } from "@/@shared/interfaces/schedule-slot";
import { prisma } from "@/@shared/lib/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { format, isWithinInterval } from "date-fns";
import { NextResponse } from "next/server";
import QuickChart from "quickchart-js";
import ExcelJS from "exceljs";

export type IMeetingReport = Prisma.MeetingGetPayload<{
  include: {
    account: true,
    organizer: true,
    slot: true,
    client: true,
  };
}>;

export type MeetingPedding = {
  type: 'wwt' | 'fleet';
  data: Prisma.WanwayClientGetPayload<{}>
    | Prisma.BFleetClientEntityGetPayload<{}>;
}

export async function GET() {
  try {
    const meetingHeld = prisma.meeting.findMany({
      where: {
        slot: {
          status: "BOOKED",
          end: { lte: new Date() },
        },
      },
      include: { slot: true, client: true, organizer: true, account: true },
    });

    const meetingScheduled = prisma.meeting.findMany({
      where: {
        slot: {
          status: "BOOKED",
          start: { gt: new Date() },
        },
      },
      include: { slot: true, client: true, organizer: true, account: true },
    });

    const meetingWWTPending = (await prisma.wanwayClient.findMany({
      where: {
        Meeting: undefined,
        parentId: 10160758,
      },
      include: { Meeting: true },
    })).filter(item => {
      if(item.accountStatsBean.deviceTotalNo <= 1) {
        return false;
      }

      if(item.accountName.toLowerCase().includes('bws')) {
        return false;
      }

      return true;
    })

    const meetingFleetsPending = (await prisma.bFleetClientEntity.findMany({
      include: { Meeting: true },
    })).filter(item => {
      if(item.Meeting.length >= 1) return false;

      return true;
    })

    const meetingPedding = ([
      meetingWWTPending.map(item => ({ type: 'wwt', data: item })),
      meetingFleetsPending.map(item => ({ type: '', data: item })),
    ]).flat() as MeetingPedding[]

    const formatToExcelPedding = (item: MeetingPedding) => {
      if(item.type === 'wwt') {
        const client = item.data as Prisma.WanwayClientGetPayload<{}>
        return {
          Nome: client.accountName,
          Email: client.email ?? '--',
          "Origem": "WWT",
          "Qtd. Dispositivos": client.accountStatsBean?.deviceNo ?? 0,
          "Total Dispositivos": client.accountStatsBean?.deviceTotalNo ?? 0,
          "Qtd. Subclientes": client.isLeaf
        }
      }

      const client = item.data as Prisma.BFleetClientEntityGetPayload<{}>
      return {
        Nome: client.bwfleet?.name ?? '--',
        Email: client.bwfleet?.email ?? '--',
        "Origem": "BWFleet Migration",
        "Qtd. Dispositivos": "--",
        "Total Dispositivos": "--",
        "Qtd. Subclientes": "--"
      }
    }

    const formatMeetingsPedding = (meetings: MeetingPedding[]) => meetings.map(formatToExcelPedding);

    const meetingCancelled = prisma.meeting.findMany({
      where: { status: "CANCELED" },
      include: { slot: true, client: true, organizer: true, account: true },
    });

    const [held, scheduled, cancelled] = await Promise.all([
      meetingHeld,
      meetingScheduled,
      meetingCancelled,
    ]);

    const [heldCount, scheduledCount, cancelledCount, peddingCount] = [
      held.length,
      scheduled.length,
      cancelled.length,
      meetingPedding.length
    ];

    const meetingsForGraphic = [...held, ...scheduled];

    const meetingsPerDay = meetingsForGraphic.reduce((acc, meeting) => {
      if (!meeting.slot) return acc;
      const dateKey = format(new Date(meeting.slot.start), "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = { count: 0 };
      }
      
      acc[dateKey].count += 1;
      return acc;
    }, {} as Record<string, { count: number }>);

    const chart = new QuickChart();
    chart.setConfig({
      type: "bar",
      data: {
        labels: Object.keys(meetingsPerDay),
        datasets: [
          {
            label: "Reuniões por dia",
            data: Object.values(meetingsPerDay).map(item => item.count),
          },
        ],
      },
    });

// gera buffer da imagem
const imageBuffer = await chart.toBinary();

    const generalStatus = [
      { Status: "TOTAL", Quantidade: heldCount + scheduledCount + cancelledCount },
      { Status: "REALIZADAS", Quantidade: heldCount },
      { Status: "AGENDADAS", Quantidade: scheduledCount },
      { Status: "CANCELADAS", Quantidade: cancelledCount },
      { Status: "PENDENTES", Quantidade: peddingCount },
    ];

    const formatTime = ({ end, start }: Pick<IScheduleSlot, "start" | "end">) => {
      const startTime = format(start, "HH:mm");
      const endTime = format(end, "HH:mm");
      return [startTime, endTime].join(" - ");
    };

    const getStatus = (meeting: IMeetingReport) => {
      if (meeting.status === "CANCELED") return "Cancelada";
      if (!meeting.slot) return "--";
      const startDate = new Date(meeting.slot.start);
      const endDate = new Date(meeting.slot.end);
      const withinInterval = isWithinInterval(new Date(), {
        start: startDate,
        end: endDate,
      });

      if (withinInterval) return "Em andamento";
      if (startDate > new Date()) return "Agendado";
      if (endDate <= new Date()) return "Concluída";
      return "Agendado";
    };

    const getName = (meeting: IMeetingReport) => {
      if (meeting.client?.bwfleet) return meeting.client.bwfleet.name;
      if (meeting.account) return meeting.account.userName;
      if (meeting.email) return meeting.email;
      return "--";
    };

    const formatMeeting = (meeting: IMeetingReport) => ({
      Cliente: getName(meeting),
      "Cliente Migrado": meeting.account ? "Sim" : "Não",
      Email: meeting.email ?? meeting.account?.email ?? "--",
      Horário: meeting.slot
        ? `${format(new Date(meeting.slot.start), "dd/MM/yyyy")} / ${formatTime(
            meeting.slot
          )}`
        : "--",
      Organizador: meeting.organizer?.name,
      Status: getStatus(meeting),
    });

    const formatMeetings = (meetings: IMeetingReport[]) => meetings.map(formatMeeting);

    // Cria workbook
    const workbook = new ExcelJS.Workbook();

    function addSheetWithStyle(data: any[], name: string) {
      const worksheet = workbook.addWorksheet(name);

      if (data.length === 0) return;

      // adiciona cabeçalho
      worksheet.columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key,
        width: Math.max(key.length + 2, 20), // largura mínima
      }));

      // adiciona linhas
      data.forEach((row) => worksheet.addRow(row));

      // estilos do cabeçalho
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F81BD" }, // azul
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // bordas para todas as células
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });
      return worksheet;
    }

    const principalSheet = addSheetWithStyle(generalStatus, "Status Geral");
    addSheetWithStyle(formatMeetings(held), "Reuniões Realizadas");
    addSheetWithStyle(formatMeetings(scheduled), "Reuniões Agendadas");
    addSheetWithStyle(formatMeetings(cancelled), "Reuniões Canceladas");
    addSheetWithStyle(formatMeetingsPedding(meetingPedding), "Clientes Pendentes");

  const imageId = workbook.addImage({
    buffer: imageBuffer as any,
    extension: "png",
  });

  // posiciona a imagem na planilha (células C2 até K20, ajusta conforme precisar)
  principalSheet?.addImage(imageId, {
    // @ts-ignore
    tl: { col: 0, row: 6 }, // top-left
    // @ts-ignore
    br: { col: 10, row: 20 }, // bottom-right
    editAs: "oneCell",
  });

    // gera buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // return new NextResponse("Relatório gerado com sucesso. Em breve você receberá um email com o arquivo.", { status: 200 });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="migracao-wwt.xlsx"',
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error?.message });
    }
    return NextResponse.json({ success: false, error: "Erro desconhecido" });
  }
}
