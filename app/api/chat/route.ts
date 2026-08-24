import { NextResponse } from "next/server";
import { processChatRequest, getChatHistoryBySessionId } from "@/lib/services/chatService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({
      success: false,
      error: "sessionId query parameter is required.",
      messages: [],
    }, { status: 400 });
  }

  const messages = await getChatHistoryBySessionId(sessionId);

  return NextResponse.json({
    success: true,
    sessionId,
    count: messages.length,
    messages,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("--------------------------------------------------");
    console.log("📩 [/api/chat API ROUTE] Incoming Request Body:");
    console.log(JSON.stringify(body, null, 2));

    const result = await processChatRequest(body);

    console.log("📤 [/api/chat API ROUTE] Sending Response Back to Client:");
    console.log(JSON.stringify(result, null, 2));
    console.log("--------------------------------------------------\n");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ [/api/chat API ROUTE ERROR]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal Server Error in /api/chat",
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
