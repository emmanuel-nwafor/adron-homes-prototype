import { connectToDatabase } from "@/lib/db";
import { ChatMessageModel } from "@/lib/models/ChatMessageModel";
import { sendChatToN8n } from "@/lib/n8n";
import { N8nChatPayload } from "@/types/property";

export async function processChatRequest(payload: N8nChatPayload) {
  const dbStatus = await connectToDatabase();

  if (dbStatus.isConnected) {
    try {
      await ChatMessageModel.create({
        sessionId: payload.sessionId,
        sender: "user",
        text: payload.message,
        isWebhookResponse: false,
      });
    } catch (err) {
      // Mongo error fallback
    }
  }

  const n8nResult = await sendChatToN8n(payload);

  if (dbStatus.isConnected) {
    try {
      await ChatMessageModel.create({
        sessionId: payload.sessionId,
        sender: "assistant",
        text: n8nResult.response.output || "Message processed.",
        suggestedActions: n8nResult.response.suggestedActions,
        relatedPropertyIds: n8nResult.response.relatedPropertyIds,
        isWebhookResponse: !n8nResult.isMock,
      });
    } catch (err) {
      // Mongo error fallback
    }
  }

  return {
    success: true,
    data: n8nResult.response,
    response: n8nResult.response.output,
    output: n8nResult.response.output,
    meta: {
      isMockFallback: n8nResult.isMock,
      n8nUrl: n8nResult.n8nUrlUsed,
      statusCode: n8nResult.statusCode,
      rawResponse: n8nResult.rawResponse,
      isMongoDbSaved: dbStatus.isConnected,
      timestamp: new Date().toISOString(),
    },
  };
}

export const processUserChatMessage = processChatRequest;

/**
 * Fetch saved conversation history for a specific sessionId from MongoDB Atlas
 */
export async function getChatHistoryBySessionId(sessionId: string) {
  const dbStatus = await connectToDatabase();

  if (!dbStatus.isConnected) {
    return [];
  }

  try {
    const docs = await ChatMessageModel.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    return docs.map((doc: any) => ({
      id: String(doc._id),
      sender: doc.sender as "user" | "assistant" | "system",
      text: doc.text,
      timestamp: new Date(doc.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: doc.suggestedActions,
      relatedPropertyIds: doc.relatedPropertyIds,
    }));
  } catch (err) {
    return [];
  }
}
