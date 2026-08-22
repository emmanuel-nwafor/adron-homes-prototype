import { NextResponse } from "next/server";
import { processUserChatMessage } from "@/lib/services/chatService";
import { N8nChatPayload } from "@/types/property";

export async function POST(request: Request) {
  try {
    const body: N8nChatPayload = await request.json();

    if (!body.message || typeof body.message !== "string" || body.message.trim() === "") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const payload: N8nChatPayload = {
      message: body.message.trim(),
      sessionId: body.sessionId || `session_${Date.now()}`,
      userContext: body.userContext,
    };

    const result = await processUserChatMessage(payload);

    return NextResponse.json({
      success: true,
      data: result.response,
      meta: {
        ...result.meta,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error processing chat route:", error);
    return NextResponse.json(
      { error: "Failed to process chat request", details: error.message },
      { status: 500 }
    );
  }
}
