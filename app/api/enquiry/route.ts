import { NextResponse } from "next/server";
import { processLeadEnquiry, ExtendedEnquiryPayload } from "@/lib/services/enquiryService";

export async function POST(request: Request) {
  try {
    const body: ExtendedEnquiryPayload = await request.json();

    if (!body.fullName || !body.phone) {
      return NextResponse.json(
        { error: "Full Name and Phone Number are required." },
        { status: 400 }
      );
    }

    const result = await processLeadEnquiry(body);

    return NextResponse.json({
      success: true,
      message: result.message,
      meta: {
        ...result.meta,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error submitting lead enquiry route:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry", details: error.message },
      { status: 500 }
    );
  }
}
