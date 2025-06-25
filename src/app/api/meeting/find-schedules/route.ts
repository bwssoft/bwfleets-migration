import { FindAllScheduleSlot } from '@/@shared/actions/schedule-slot.action'
import { NextResponse } from 'next/server'

export async function GET() {
  try {

    const response = await FindAllScheduleSlot()

    return NextResponse.json({ success: true, data: response })
  }
  catch (error) {
    if(error instanceof Error) {
      return NextResponse.json({ success: false, error: error?.message })
    }
  }
}