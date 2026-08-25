import { N8nChatPayload, N8nChatResponse, EnquiryPayload } from "@/types/property";
import { fetchAllProperties } from "@/lib/services/propertyService";

/**
 * Parses numeric budgets from user text (e.g., "10 million naira" -> 10000000, "5M" -> 5000000).
 */
function parseBudgetFromMessage(text: string): number | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  const millionMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:million|m\b)/i);
  if (millionMatch) {
    const num = parseFloat(millionMatch[1]);
    return num * 1000000;
  }

  const rawNumberMatch = lower.match(/[\d,]{6,}/);
  if (rawNumberMatch) {
    const num = parseInt(rawNumberMatch[0].replace(/,/g, ""), 10);
    if (!isNaN(num)) return num;
  }

  return null;
}

/**
 * Safely extracts human-readable text from n8n JSON responses or fallback payloads.
 * Prevents raw JSON strings or empty objects like {"success":true,"sessionId":"..."} from leaking into the UI.
 */
async function extractHumanText(parsedData: any, rawText: string, userMessage?: string): Promise<string> {
  if (!parsedData) return rawText;

  // If parsedData is a string, check if it's JSON
  if (typeof parsedData === "string") {
    const trimmed = parsedData.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const obj = JSON.parse(trimmed);
        return extractHumanText(obj, rawText, userMessage);
      } catch {
        return parsedData;
      }
    }
    return parsedData;
  }

  if (typeof parsedData === "object" && parsedData !== null) {
    // Check candidate response fields from n8n
    const candidates = [
      parsedData.response,
      parsedData.output,
      parsedData.message,
      parsedData.text,
      parsedData.reply,
      parsedData.data?.output,
      parsedData.data?.response,
      parsedData.data?.message,
    ];

    for (const cand of candidates) {
      if (typeof cand === "string" && cand.trim().length > 0) {
        return cand;
      }
    }

    // If n8n returned {"success": true, "sessionId": "..."} without any text field
    console.warn("⚠️ n8n webhook returned JSON with null/empty response field:", parsedData);

    // Generate intelligent live real-estate answer based on user prompt!
    if (userMessage) {
      const budget = parseBudgetFromMessage(userMessage);
      const lower = userMessage.toLowerCase();
      const { properties } = await fetchAllProperties();

      // 1. Featured Estates Request
      if (lower.includes("feature") || lower.includes("popular") || lower.includes("top")) {
        const featured = properties.filter((p) => p.featured);
        let reply = "Here are our top **Featured Adron Homes Estates**:\n\n";
        featured.forEach((p) => {
          const price = p.promoStartingPrice || p.startingPrice;
          const priceFormatted = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(price);
          reply += `* 🏡 **${p.name}** (${p.location}, ${p.state})\n`;
          reply += `  - **Starting Price**: ${priceFormatted} (${p.discountPercentage ? `${p.discountPercentage}% Promo Discount` : "Special Offer"})\n`;
          reply += `  - **Title Document**: ${p.titleDocument}\n`;
          reply += `  - **36-Month Plan**: Available with initial deposit from ₦${(p.minInitialDeposit / 1000000).toFixed(1)}M\n`;
          if (p.images && p.images[0]) {
            reply += `  ![${p.name}](${p.images[0]})\n`;
          }
          reply += `\n`;
        });
        reply += "Would you like to calculate a 36-month flexible payment plan or book a free site tour?";
        return reply;
      }

      // 2. Specific Budget Match Request
      if (budget && budget > 0) {
        const formattedBudget = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(budget);
        const matching = properties.filter((p) => (p.promoStartingPrice || p.startingPrice) <= budget);

        if (matching.length > 0) {
          let reply = `With your budget of **${formattedBudget}**, here are top verified **Adron Homes Estates** you can acquire:\n\n`;
          matching.forEach((p) => {
            const price = p.promoStartingPrice || p.startingPrice;
            const priceFormatted = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(price);
            const plotsCount = Math.floor(budget / price);

            reply += `* 🏡 **${p.name}** (${p.location}, ${p.state})\n`;
            reply += `  - **Price**: ${priceFormatted} (${p.discountPercentage ? `${p.discountPercentage}% Discount` : "Promo"})\n`;
            reply += `  - **Title**: ${p.titleDocument}\n`;
            if (plotsCount > 1) {
              reply += `  - **Capacity**: Your budget can buy **${plotsCount} plots** outright!\n`;
            }
            reply += `  - **36-Month Plan**: Available with initial deposit from ₦${(p.minInitialDeposit / 1000000).toFixed(1)}M\n`;
            if (p.images && p.images[0]) {
              reply += `  ![${p.name}](${p.images[0]})\n`;
            }
            reply += `\n`;
          });
          return reply;
        } else {
          return `With a budget of **${formattedBudget}**, you can easily make an initial deposit on our luxury prime estates like **Town Park & Gardens (Ibeju-Lekki)** or **Eko City (Shimawa)** and spread the remaining balance over **36 flexible monthly installments**!\n\nWould you like to calculate a 36-month payment breakdown or book a free site tour?`;
        }
      }

      // 3. Tour Inspection Booking Request
      if (lower.includes("inspection") || lower.includes("tour") || lower.includes("visit") || lower.includes("tomorrow")) {
        return "🚌 **Book a Free Site Inspection Tour**\n\nWe organize free physical inspection tours every **Tuesday, Thursday, and Saturday** departing from our Adron Homes offices in Lagos, Ogun, and Abuja!\n\n* **Includes**: Free executive bus seat & guided site walkthrough with an estate consultant.\n\nTo reserve your seat now, please provide your **Full Name**, **Phone Number**, and **Preferred Date**!";
      }

      // 4. Payment Plan / Installment Calculation Request
      if (lower.includes("payment") || lower.includes("installment") || lower.includes("36") || lower.includes("how")) {
        return "💳 **Adron Homes 36-Month Flexible Payment Plan**\n\nWe offer Nigeria's most flexible estate payment structure:\n* 💰 **Daily Equivalent**: Pay as low as **₦2,750 / day**\n* 📅 **Monthly Spread**: Pay equal installments over 12, 24, or 36 months\n* 🔑 **Instant Allocation**: Start building upon initial deposit threshold!\n\nWhich estate location (Lagos, Ogun, Abuja, Oyo) would you like a custom payment breakdown for?";
      }

      // 5. Default General Catalog Listing for Any Property Prompt
      let reply = "Here are our current prime **Adron Homes Estates**:\n\n";
      properties.slice(0, 3).forEach((p) => {
        const price = p.promoStartingPrice || p.startingPrice;
        const priceFormatted = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(price);
        reply += `* 🏡 **${p.name}** (${p.location}, ${p.state})\n`;
        reply += `  - **Starting Price**: ${priceFormatted}\n`;
        reply += `  - **Title Document**: ${p.titleDocument}\n`;
        if (p.images && p.images[0]) {
          reply += `  ![${p.name}](${p.images[0]})\n`;
        }
        reply += `\n`;
      });
      reply += "Would you like more details on a specific property, plot size (300sqm / 500sqm), or site inspection tour?";
      return reply;
    }

    return "Hello! Welcome to **Adron Homes & Properties**. I am **AdBot**, your AI Assistant.\n\nI can help you with:\n* 🏡 **Finding Estates**: Lagos, Ogun, Abuja, Oyo\n* 💰 **Promotions**: Ongoing up to 50% discount offers\n* 💳 **Payment Calculator**: Daily & monthly flexible plans\n* 🚌 **Site Inspections**: Booking a free physical tour";
  }

  return rawText;
}

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
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

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

    let parsedData: any = null;
    try {
      parsedData = JSON.parse(resText);
    } catch (e) {
      parsedData = resText;
    }

    if (res.ok) {
      const aiResponseText = await extractHumanText(parsedData, resText, payload.message);

      return {
        response: {
          output: aiResponseText,
          suggestedActions: (parsedData && parsedData.suggestedActions) || [
            "Show Featured Estates",
            "Estates under ₦5 Million",
            "How Payment Plans Work",
            "Book Free Inspection",
          ],
          relatedPropertyIds: parsedData && parsedData.relatedPropertyIds,
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

    const fallbackText = await extractHumanText(null, "", payload.message);

    return {
      response: {
        output: fallbackText,
        suggestedActions: ["Estates under ₦5 Million", "How Payment Plans Work", "Book Free Inspection"],
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
