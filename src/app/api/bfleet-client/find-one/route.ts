import { findOneBFleetClient } from '@/@shared/actions/bwfleet-client.actions'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')


    if (!accountId) {
      return NextResponse.json({ error: "Missing accountId", success: false }, { status: 500 })
    }

    const response = await findOneBFleetClient({
      where: {
        wwtAccountId: Number(accountId),
      },
      include: {
        migration: {
          include: {
            assigned: true,
          },
        },
        user: true,
      },
    })

    return NextResponse.json({ success: true, data: response })
  }
  catch (error) {
    if(error instanceof Error) {
      return NextResponse.json({ success: false, error: error?.message })
    }
  }
}