import { updateMigrationStatus } from '@/@shared/actions/migration.action';
import { NextResponse } from 'next/server'

type IRequestBody = {
  token: string
  uuid: string
  bfleet_uuid: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as IRequestBody;

    if (!body.token || ! body.uuid) {
      return NextResponse.json({ error: "Missing token or id", success: false }, { status: 500 })
    }
    await updateMigrationStatus({
      status: 'SUCCESS',
      uuid: body.uuid,
      token: body.token,
      bfleet_uuid: body.bfleet_uuid
    })

    return NextResponse.json({ success: true })
  }
  catch (error) {
    console.log({ error })
    if(error instanceof Error) {
      return NextResponse.json({ success: false, error: error?.message })
    }
  }
}