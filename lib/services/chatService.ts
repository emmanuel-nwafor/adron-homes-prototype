import { connectToDatabase } from "@/lib/db";
import { ChatMessageModel } from "@/lib/models/ChatMessageModel";
import { sendChatToN8n } from "@/lib/n8n";
import { N8nChatPayload } from "@/types/property";

export async function processUserChatMessage(payload: N8nChatPayload) {
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
      console.warn("[MongoDB Atlas] Error saving user message:", err);
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
      console.warn("[MongoDB Atlas] Error saving assistant response:", err);
    }
  }

  return {
    response: n8nResult.response,
    meta: {
      isMockFallback: n8nResult.isMock,
      n8nUrl: n8nResult.n8nUrlUsed,
      isMongoDbSaved: dbStatus.isConnected,
    },
  };
}
