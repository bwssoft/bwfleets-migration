/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient, SlotStatus } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando Seed de ScheduleSlots (pulando almoço)...')

  const startDate = new Date('2026-01-05T03:00:00.000Z')
  const numberOfDays = 67

  const slotsData = []

  let currentDate = new Date(startDate)
  let daysAdded = 0

  while (daysAdded < numberOfDays) {
    const dayOfWeek = currentDate.getDay()

    // Segunda (1) a sexta (5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      for (let hour = 14; hour < 16; hour++) {
        // Pula o horário do almoço: não cria slot das 12:00 às 13:00
        if (hour === 12) continue

        const start = new Date(currentDate)
        start.setHours(hour, 0, 0, 0)

        const end = new Date(currentDate)
        end.setHours(hour + 1, 0, 0, 0)

        slotsData.push({
          start,
          end,
          status: SlotStatus.AVAILABLE,
        })
      }
      daysAdded++
    }

    // Avança para o próximo dia
    currentDate.setDate(currentDate.getDate() + 1)
  }
  // slotsData.map((slot) => {
  //   console.log(`🕒 Slot: ${slot.start.toISOString()} - ${slot.end.toISOString()}`)
  // })
  console.log(`👉 Total de slots para inserir: ${slotsData.length}`)

  if (slotsData.length > 0) {
    const result = await prisma.scheduleSlot.createMany({
      data: slotsData,
    })
    // console.log(slotsData)
    console.log(`✅ Slots criados: ${result.count}`)
  } else {
    console.log('⚠️ Nenhum slot para criar.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
