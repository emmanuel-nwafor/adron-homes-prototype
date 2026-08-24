import { NextResponse } from "next/server";
import { processLeadEnquiry } from "@/lib/services/enquiryService";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    console.log("\n================ [/api/enquiry INCOMING PAYLOAD] ================");
    console.log(JSON.stringify(rawBody, null, 2));

    // Normalize field aliases so requests from n8n or web forms work seamlessly
    const fullName = rawBody.fullName || rawBody.name || rawBody.customerName;
    const phone = rawBody.phone || rawBody.phoneNumber || rawBody.telephone;
    const email = rawBody.email || "";
    const title = rawBody.title || "";
    const sessionId = rawBody.sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const propertyId = rawBody.propertyId || "";
    const propertyTitle = rawBody.propertyTitle || rawBody.propertyName || rawBody.propertyId || "";
    const preferredInspectionDate = rawBody.preferredInspectionDate || rawBody.inspectionDate || "";
    const message = rawBody.message || rawBody.enquiry || (rawBody.budget ? `Budget: ${rawBody.budget}` : "");
    const referredByMarketer = rawBody.referredByMarketer || false;
    const leadSource = rawBody.leadSource || (rawBody.enquiryType ? `n8n Tool (${rawBody.enquiryType})` : "Adron Web Lead Form");
    const isFromN8n = Boolean(rawBody.type || rawBody.enquiryType);

    if (!fullName || !phone) {
      console.warn("❌ Rejected enquiry: Missing fullName or phone", { fullName, phone });
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error: Customer Name (name or fullName) and Phone number are required.",
          receivedPayload: rawBody,
        },
        { status: 400 }
      );
    }

    const normalizedPayload = {
      sessionId,
      title,
      fullName,
      email,
      phone,
      referredByMarketer,
      propertyId,
      propertyTitle,
      preferredInspectionDate,
      message,
      leadSource,
      isFromN8n,
    };

    const result = await processLeadEnquiry(normalizedPayload);

    console.log("✅ [/api/enquiry SUCCESS]:", result.message);
    console.log("=================================================================\n");

    return NextResponse.json({
      success: true,
      message: result.message,
      lead: {
        sessionId,
        fullName,
        phone,
        email,
        propertyTitle,
        preferredInspectionDate,
      },
      meta: {
        ...result.meta,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("❌ Error submitting lead enquiry route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit enquiry", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
