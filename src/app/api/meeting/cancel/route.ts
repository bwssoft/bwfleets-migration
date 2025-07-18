import { cancelMeeting } from "@/@shared/actions/meeting.actions";
import { NextResponse } from "next/server";

type IRequestBody = {
  meeting_id: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as IRequestBody;

    await cancelMeeting(body)
    
    return NextResponse.json({ success: true })

  } catch (error) {
    if(error instanceof Error) {
      return NextResponse.json({ success: false, error: error?.message })
    }
  }
}