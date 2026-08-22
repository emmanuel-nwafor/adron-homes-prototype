import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PropertyModel } from "@/lib/models/PropertyModel";
import { ADRON_PROPERTIES } from "@/lib/data/properties";

export async function GET() {
  const dbStatus = await connectToDatabase();

  if (!dbStatus.isConnected) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB Atlas database.",
        error: dbStatus.error,
      },
      { status: 500 }
    );
  }

  try {
    await PropertyModel.deleteMany({});
    const insertedDocs = await PropertyModel.insertMany(
      ADRON_PROPERTIES.map((p) => ({
        ...p,
        slug: p.slug || p.id,
      }))
    );

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedDocs.length} Adron estate properties into MongoDB Atlas database.`,
      seededCount: insertedDocs.length,
      databaseName: dbStatus.dbName,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error seeding property catalog into MongoDB Atlas.",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
