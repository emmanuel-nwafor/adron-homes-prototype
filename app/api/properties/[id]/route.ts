import { NextResponse } from "next/server";
import { fetchPropertyById } from "@/lib/services/propertyService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = await fetchPropertyById(id);

  if (!property) {
    return NextResponse.json(
      { error: "Property not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(property);
}
