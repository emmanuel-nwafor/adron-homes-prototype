import { connectToDatabase } from "@/lib/db";
import { EnquiryModel } from "@/lib/models/EnquiryModel";
import { sendEnquiryToN8n } from "@/lib/n8n";
import { EnquiryPayload } from "@/types/property";

export interface ExtendedEnquiryPayload extends EnquiryPayload {
  sessionId?: string;
  title?: string;
  referredByMarketer?: boolean;
  isSubscription?: boolean;
  isFromN8n?: boolean;
}

export async function processLeadEnquiry(payload: ExtendedEnquiryPayload) {
  const dbStatus = await connectToDatabase();
  let isMongoDbSaved = false;

  if (dbStatus.isConnected) {
    try {
      const doc = await EnquiryModel.create({
        title: payload.title || "",
        fullName: payload.fullName,
        email: payload.email || "",
        phone: payload.phone,
        referredByMarketer: payload.referredByMarketer || false,
        isSubscription: payload.isSubscription || false,
        propertyId: payload.propertyId || "",
        propertyTitle: payload.propertyTitle || "",
        preferredInspectionDate: payload.preferredInspectionDate || "",
        message: payload.message || "",
        leadSource: payload.leadSource || "Adron Web Prototype",
        status: payload.isSubscription || payload.referredByMarketer ? "subscribed" : "new",
      });
      isMongoDbSaved = true;
    } catch (err) {
      // Mongo error fallback
    }
  }

  // Only dispatch to n8n if request originated from web frontend
  let n8nResult = { success: true, message: "Lead recorded in database.", isMock: false };
  if (!payload.isFromN8n) {
    n8nResult = await sendEnquiryToN8n(payload);
  }

  return {
    success: true,
    message: payload.isFromN8n
      ? `Lead enquiry for ${payload.fullName} (${payload.phone}) successfully recorded in Adron CRM!`
      : n8nResult.message,
    meta: {
      isMockFallback: n8nResult.isMock,
      isMongoDbSaved,
    },
  };
}
