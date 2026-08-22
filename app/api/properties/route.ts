import { NextResponse } from "next/server";
import { fetchAllProperties } from "@/lib/services/propertyService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query") || undefined;
  const state = searchParams.get("state") || undefined;
  const type = searchParams.get("type") || undefined;
  const maxPriceStr = searchParams.get("maxPrice");
  const maxPrice = maxPriceStr ? Number(maxPriceStr) : undefined;
  const featured = searchParams.get("featured") === "true";

  const result = await fetchAllProperties({
    query,
    state,
    type,
    maxPrice,
    featured,
  });

  return NextResponse.json({
    total: result.properties.length,
    properties: result.properties,
    meta: {
      isMongoDb: result.isMongoDb,
    },
  });
}
