import { N8nChatPayload, N8nChatResponse, EnquiryPayload } from "@/types/property";

const DEFAULT_PROD_WEBHOOK_URL = "https://emstack.onrender.com/webhook-test/ccfa55ae-10d2-41a7-b582-bd2c646036c7";

/**
 * Send chat payload to Webhook with VERBOSE LOGGING and NO MOCK FALLBACK.
 */
export async function sendChatToN8n(payload: N8nChatPayload): Promise<{
  response: N8nChatResponse;
  isMock: boolean;
  n8nUrlUsed?: string;
  statusCode?: number;
  rawResponse?: string;
}> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL || DEFAULT_PROD_WEBHOOK_URL;

  console.log("\n================ [N8N CHAT DISPATCH START] ================");
  console.log("🚀 TARGET WEBHOOK URL:", webhookUrl);
  console.log("📦 PAYLOAD SENT TO WEBHOOK:", JSON.stringify(payload, null, 2));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout

    const startTime = Date.now();
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      return {
        response: {
          output: parsedData.output || parsedData.reply || parsedData.message || parsedData.text || resText,
          suggestedActions: parsedData.suggestedActions || ["View Properties", "Book Free Tour", "Contact Representative"],
          relatedPropertyIds: parsedData.relatedPropertyIds,
        },
        isMock: false,
        n8nUrlUsed: webhookUrl,
        statusCode: res.status,
        rawResponse: resText,
      };
    } else {
      // Direct N8N Error returned (NO MOCK FALLBACK)
      return {
        response: {
          output: `⚠️ **n8n Webhook Error (${res.status})**:\n\n\`\`\`json\n${resText}\n\`\`\`\n\n*Hint: Click "Execute workflow" in your n8n canvas first so n8n listens for this test call!*`,
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
        output: `⚠️ **Connection Error calling n8n Webhook**:\n\`${error?.message || "Fetch Failed"}\`\n\nTarget URL: \`${webhookUrl}\``,
        suggestedActions: ["Check Network", "Verify Webhook URL"],
      },
      isMock: false,
      n8nUrlUsed: webhookUrl,
      rawResponse: String(error),
    };
  }
}

/**
 * Send property enquiry to lead generation workflow with VERBOSE LOGGING
 */
export async function sendEnquiryToN8n(payload: EnquiryPayload): Promise<{
  success: boolean;
  message: string;
  isMock: boolean;
  statusCode?: number;
  rawResponse?: string;
}> {
  const webhookUrl = process.env.N8N_ENQUIRY_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL || DEFAULT_PROD_WEBHOOK_URL;

  console.log("\n================ [N8N ENQUIRY DISPATCH START] ================");
  console.log("🚀 TARGET WEBHOOK URL:", webhookUrl);
  console.log("📦 PAYLOAD SENT TO WEBHOOK:", JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PROPERTY_ENQUIRY", ...payload }),
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
