import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") || undefined;

  const faqKnowledgebase = {
    paymentStructure: {
      title: "Flexible Payment Options",
      description: "Adron Homes offers stress-free land ownership with zero interest on flexible installments.",
      options: [
        { plan: "Outright (0-30 Days)", discount: "Up to 50% Promo Discount", description: "Maximum price reduction upon lump sum payment." },
        { plan: "12 Months Installment", deposit: "From ₦100,000", description: "Equal monthly installments divided over 1 year." },
        { plan: "36 Months Super Flexible", deposit: "From ₦50,000", dailyEquivalent: "From ₦2,750 / day", description: "Long-term daily or monthly installment plan." }
      ]
    },
    titleDocuments: {
      title: "Legal Title Verification",
      description: "Every Adron estate possesses verified government documentation 100% free from Omo-onile or acquisition claims.",
      documents: [
        { estate: "Eko City Shimawa", title: "Certificate of Occupancy (C of O)", status: "Verified" },
        { estate: "Manhattan Park Abuja", title: "Certificate of Occupancy (C of O)", status: "Verified" },
        { estate: "Town Park Ibeju-Lekki", title: "Approved Excision / C of O in Process", status: "Verified" }
      ]
    },
    siteInspections: {
      title: "Free Daily Site Tour Inspections",
      schedule: "Monday through Saturday, 10:00 AM & 1:00 PM departures",
      transport: "Free luxury air-conditioned executive buses provided by Adron Homes",
      departureHubs: [
        "Headquarters: 75B, Opebi Road, Ikeja, Lagos State",
        "Abuja Office: Plot 102, Aminu Kano Crescent, Wuse 2, Abuja",
        "Ibadan Office: Ring Road Axis, Ibadan, Oyo State"
      ]
    },
    physicalAllocation: {
      title: "Instant Physical Plot Allocation",
      rule: "Subscribers receive instant physical plot demarcation upon completion of initial deposit requirements and verification."
    }
  };

  if (topic && topic in faqKnowledgebase) {
    return NextResponse.json({
      success: true,
      topic,
      data: (faqKnowledgebase as any)[topic]
    });
  }

  return NextResponse.json({
    success: true,
    data: faqKnowledgebase
  });
}
