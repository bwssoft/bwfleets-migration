import { completeMigration } from "@/@shared/actions/migration.action";
import { NextResponse } from "next/server"

type IRequestBody = {
    bfleet_uuid: string
    wwt_account_id: string
}
export async function POST(request: Request) {
  try {
    const body = await request.json() as IRequestBody;

    await completeMigration(body)

    return NextResponse.json({ success: true })
  }
  catch (error) {
    console.log({ error })
    if(error instanceof Error) {
      return NextResponse.json({ success: false, error: error?.message })
    }
  }
}