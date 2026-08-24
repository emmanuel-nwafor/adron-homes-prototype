import { NextResponse } from "next/server";
import { processChatRequest } from "@/lib/services/chatService";

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
