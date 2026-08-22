import { connectToDatabase } from "@/lib/db";
import { EnquiryModel } from "@/lib/models/EnquiryModel";
import { sendEnquiryToN8n } from "@/lib/n8n";
import { EnquiryPayload } from "@/types/property";

export interface ExtendedEnquiryPayload extends EnquiryPayload {
  title?: string;
  referredByMarketer?: boolean;
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
        propertyId: payload.propertyId || "",
        propertyTitle: payload.propertyTitle || "",
        preferredInspectionDate: payload.preferredInspectionDate || "",
        message: payload.message || "",
        leadSource: payload.leadSource || "Adron Web Prototype",
        status: payload.referredByMarketer ? "subscribed" : "new",
      });
      console.log(`[MongoDB Atlas] Successfully recorded lead subscription ID: ${doc._id}`);
      isMongoDbSaved = true;
    } catch (err) {
      console.warn("[MongoDB Atlas] Error creating lead enquiry document:", err);
    }
  }

  const n8nResult = await sendEnquiryToN8n(payload);

  return {
    success: true,
    message: n8nResult.message,
    meta: {
      isMockFallback: n8nResult.isMock,
      isMongoDbSaved,
    },
  };
}
