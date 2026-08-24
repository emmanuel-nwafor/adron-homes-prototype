import { N8nChatPayload, N8nChatResponse, EnquiryPayload } from "@/types/property";

/**
 * Dispatch chat payload to n8n Webhook using process.env.N8N_WEBHOOK_URL.
 */
export async function sendChatToN8n(payload: N8nChatPayload): Promise<{
  response: N8nChatResponse;
  isMock: boolean;
  n8nUrlUsed?: string;
  statusCode?: number;
  rawResponse?: string;
}> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.trim() === "") {
    console.error("❌ ERROR: N8N_WEBHOOK_URL environment variable is not defined in .env.local!");
    return {
      response: {
        output: "⚠️ **Configuration Error**: `N8N_WEBHOOK_URL` is not defined in `.env.local`. Please configure your environment variable.",
        suggestedActions: ["Check .env.local file"],
      },
      isMock: false,
      n8nUrlUsed: "NOT_CONFIGURED",
    };
  }

  // Ensure sessionId is always present
  const sanitizedPayload = {
    ...payload,
    sessionId: payload.sessionId || `session_${Date.now()}`,
  };

  console.log("\n================ [N8N CHAT DISPATCH START] ================");
  console.log("🚀 TARGET WEBHOOK URL (from env):", webhookUrl);
  console.log("📦 PAYLOAD SENT TO WEBHOOK:", JSON.stringify(sanitizedPayload, null, 2));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    const startTime = Date.now();
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizedPayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const elapsedTime = Date.now() - startTime;
    const resText = await res.text();

    console.log(`📥 WEBHOOK RESPONSE RECEIVED (${elapsedTime}ms):`);
    console.log(`STATUS CODE: ${res.status} ${res.statusText}`);
    console.log(`RAW RESPONSE BODY:`, resText);
    console.log("================ [N8N CHAT DISPATCH END] ==================\n");

    let parsedData: any = {};
    try {
      parsedData = JSON.parse(resText);
    } catch (e) {
      parsedData = { text: resText };
    }

    if (res.ok) {
      const aiResponseText =
        parsedData.response ||
        parsedData.output ||
        parsedData.message ||
        parsedData.text ||
        (typeof parsedData === "string" ? parsedData : resText);

      return {
        response: {
          output: aiResponseText,
          suggestedActions: parsedData.suggestedActions || [
            "Tell me about 300sqm plot",
            "How do payment plans work?",
            "Book free site inspection",
            "Have someone contact me",
          ],
          relatedPropertyIds: parsedData.relatedPropertyIds,
        },
        isMock: false,
        n8nUrlUsed: webhookUrl,
        statusCode: res.status,
        rawResponse: resText,
      };
    } else {
      return {
        response: {
          output: `⚠️ **n8n Webhook Error (${res.status})**:\n\n\`\`\`json\n${resText}\n\`\`\`\n\n*Hint: Click "Execute workflow" in your n8n canvas first so n8n listens for incoming calls!*`,
          suggestedActions: ["Retry Request", "Check n8n Canvas"],
        },
        isMock: false,
        n8nUrlUsed: webhookUrl,
        statusCode: res.status,
        rawResponse: resText,
      };
    }
  } catch (error: any) {
    console.error("❌ WEBHOOK FETCH ERROR:", error?.message || error);
    console.log("================ [N8N CHAT DISPATCH END] ==================\n");

    return {
      response: {
        output: `⚠️ **Connection Error calling n8n Webhook**:\n\`${error?.message || "Fetch Failed"}\`\n\nTarget Environment URL: \`${webhookUrl}\``,
        suggestedActions: ["Check Network", "Verify N8N_WEBHOOK_URL in .env.local"],
      },
      isMock: false,
      n8nUrlUsed: webhookUrl,
      rawResponse: String(error),
    };
  }
}

/**
 * Dispatch property enquiry to lead generation workflow with guaranteed sessionId and isSubscription flag.
 */
export async function sendEnquiryToN8n(payload: EnquiryPayload & { sessionId?: string; isSubscription?: boolean }): Promise<{
  success: boolean;
  message: string;
  isMock: boolean;
  statusCode?: number;
  rawResponse?: string;
}> {
  const webhookUrl = process.env.N8N_ENQUIRY_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.trim() === "") {
    return {
      success: false,
      message: "N8N_ENQUIRY_WEBHOOK_URL is not configured in .env.local",
      isMock: false,
    };
  }

  const sessionId = payload.sessionId || `enquiry_session_${Date.now()}`;
  const enquiryBody = {
    type: "PROPERTY_ENQUIRY",
    enquiryType: "lead",
    sessionId: sessionId,
    isSubscription: payload.isSubscription || false,
    name: payload.fullName,
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email || "",
    propertyId: payload.propertyId || "",
    propertyTitle: payload.propertyTitle || "",
    preferredInspectionDate: payload.preferredInspectionDate || "",
    message: payload.message || "Property enquiry submission",
  };

  console.log("\n================ [N8N ENQUIRY DISPATCH START] ================");
  console.log("🚀 TARGET WEBHOOK URL (from env):", webhookUrl);
  console.log("📦 PAYLOAD SENT TO WEBHOOK:", JSON.stringify(enquiryBody, null, 2));

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiryBody),
    });

    const resText = await res.text();
    console.log(`📥 ENQUIRY WEBHOOK STATUS: ${res.status} ${res.statusText}`);
    console.log(`RAW RESPONSE BODY:`, resText);
    console.log("================ [N8N ENQUIRY DISPATCH END] ==================\n");

    return {
      success: res.ok,
      message: res.ok
        ? "Enquiry successfully transmitted to n8n Webhook!"
        : `n8n Lead Webhook Returned Status ${res.status}: ${resText}`,
      isMock: false,
      statusCode: res.status,
      rawResponse: resText,
    };
  } catch (err: any) {
    console.error("❌ LEAD WEBHOOK ERROR:", err?.message || err);
    console.log("================ [N8N ENQUIRY DISPATCH END] ==================\n");

    return {
      success: false,
      message: `Lead Webhook Error: ${err?.message || "Fetch Failed"}`,
      isMock: false,
      rawResponse: String(err),
    };
  }
}
