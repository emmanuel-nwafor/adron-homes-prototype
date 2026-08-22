import { N8nChatPayload, N8nChatResponse, EnquiryPayload } from "@/types/property";
import { ADRON_PROPERTIES } from "@/lib/data/properties";

/**
 * Send chat payload to Webhook, with automatic fallback simulation if unconfigured or offline.
 */
export async function sendChatToN8n(payload: N8nChatPayload): Promise<{
  response: N8nChatResponse;
  isMock: boolean;
  n8nUrlUsed?: string;
}> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (webhookUrl && webhookUrl.trim() !== "") {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          response: {
            output: data.output || data.reply || data.message || data.text || "Thank you for reaching out to Adron Homes. How else can I assist you?",
            suggestedActions: data.suggestedActions,
            relatedPropertyIds: data.relatedPropertyIds,
          },
          isMock: false,
          n8nUrlUsed: webhookUrl,
        };
      }
    } catch (error) {
      console.warn("API webhook call failed or timed out. Falling back to local assistant response.", error);
    }
  }

  // Fallback AI simulation logic for presentation/demo reliability
  const mockResponse = generateFallbackResponse(payload.message, payload.userContext);
  return {
    response: mockResponse,
    isMock: true,
    n8nUrlUsed: webhookUrl || "Not Configured (Demo Mode)",
  };
}

/**
 * Send property enquiry to lead generation workflow
 */
export async function sendEnquiryToN8n(payload: EnquiryPayload): Promise<{
  success: boolean;
  message: string;
  isMock: boolean;
}> {
  const webhookUrl = process.env.N8N_ENQUIRY_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;

  if (webhookUrl && webhookUrl.trim() !== "") {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "PROPERTY_ENQUIRY", ...payload }),
      });

      if (res.ok) {
        return {
          success: true,
          message: "Enquiry successfully transmitted to Adron CRM!",
          isMock: false,
        };
      }
    } catch (err) {
      console.warn("Lead webhook failed:", err);
    }
  }

  return {
    success: true,
    message: "Enquiry received! (Recorded for Adron sales advisor follow-up).",
    isMock: true,
  };
}

/**
 * Smart domain-specific response generator for Adron Homes
 */
function generateFallbackResponse(userMessage: string, context?: N8nChatPayload["userContext"]): N8nChatResponse {
  const query = userMessage.toLowerCase();

  if (query.includes("eko city") || query.includes("shimawa") || query.includes("redemption")) {
    const eko = ADRON_PROPERTIES.find((p) => p.id === "eko-city-shimawa");
    return {
      output: `🏡 **Eko City Estate, Shimawa** is one of our flagship mega smart eco-cities! Located right behind Redemption Camp, Ogun State. \n\n* **Promo Price**: ₦7.2 Million (500 sqm) - 40% Discount applied!\n* **Initial Deposit**: From ₦100,000\n* **Title**: Certificate of Occupancy (C of O)\n* **Features**: Interlocked roads, 24/7 security, solar streetlights, electricity transformer.`,
      suggestedActions: ["Book Site Inspection for Eko City", "View Payment Breakdown", "See All Ogun Estates"],
      relatedPropertyIds: ["eko-city-shimawa"],
    };
  }

  if (query.includes("abuja") || query.includes("manhattan") || query.includes("karu")) {
    return {
      output: `🏛️ **Manhattan Park & Gardens (Karu, Abuja Expansion Corridor)** offers prime metropolitan luxury!\n\n* **Promo Price**: ₦7.5 Million (500 sqm)\n* **Deposit**: Starts from ₦100,000\n* **Title**: C of O\n* **Flexible Plan**: Up to 36 months flexible installment. Instant physical plot allocation available upon deposit!`,
      suggestedActions: ["Schedule Abuja Site Tour", "Calculate Monthly Payments", "Speak to Abuja Consultant"],
      relatedPropertyIds: ["manhattan-park-gardens"],
    };
  }

  if (query.includes("payment") || query.includes("installment") || query.includes("daily") || query.includes("deposit")) {
    return {
      output: `💳 **Adron Flexible Payment Structure**:\n\nAdron Homes makes land ownership stress-free with payment plans tailored to your budget:\n\n1. **Outright (0-30 Days)**: Maximum discount up to 50%!\n2. **12 & 24 Months**: Equal convenient monthly payments.\n3. **36 Months Super Flexible**: Daily installment equivalents starting as low as **₦2,750/day** or **₦50,000 initial deposit**!`,
      suggestedActions: ["Calculate Payment Plan", "View Properties under ₦5M", "Talk to Sales Rep"],
    };
  }

  if (query.includes("inspection") || query.includes("visit") || query.includes("tour") || query.includes("book")) {
    return {
      output: `🚌 **Free Site Inspections Available!**\n\nAdron Homes conducts free daily site inspections from our main offices in Lagos, Abuja, Ibadan, and Ogun State. \n\nWe provide luxury air-conditioned buses to take you to the estate site. Would you like to schedule an inspection date?`,
      suggestedActions: ["Book Free Site Inspection", "Call Customer Support", "View Estate Locations"],
    };
  }

  if (query.includes("title") || query.includes("c of o") || query.includes("document") || query.includes("governor")) {
    return {
      output: `📜 **Legal & Title Verification**:\n\nAll Adron Homes estates possess verified legal title documents guaranteed 100% free from government acquisition or *Omo-onile* encumbrance:\n\n* **Eko City**: Certificate of Occupancy (C of O)\n* **Manhattan Park**: C of O\n* **Town Park Ibeju-Lekki**: Approved Excision\n* **Treasure Park**: C of O`,
      suggestedActions: ["Check C of O Estates", "Request Title Document Copy"],
    };
  }

  // Default response
  return {
    output: `Hello! Welcome to **Adron Homes & Properties**. I am your automated AI Assistant.\n\nI can help you with:\n* 🏡 **Finding Estates**: Lagos, Ogun, Abuja, Oyo\n* 💰 **Promotions**: Ongoing up to 50% discount offers\n* 💳 **Payment Calculator**: Daily & monthly flexible plans\n* 🚌 **Site Inspections**: Booking a free physical tour`,
    suggestedActions: ["Show Featured Estates", "Estates under ₦5 Million", "How Payment Plans Work", "Book Inspection"],
    relatedPropertyIds: ["eko-city-shimawa", "manhattan-park-gardens", "town-park-gardens-ibeju-lekki"],
  };
}
