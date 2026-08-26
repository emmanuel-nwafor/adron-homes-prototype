import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { PropertyModel } from "@/lib/models/PropertyModel";
import { ADRON_PROPERTIES } from "@/lib/data/properties";
import { Property } from "@/types/property";

export async function fetchAllProperties(filters?: {
  query?: string;
  state?: string;
  type?: string;
  maxPrice?: number;
  featured?: boolean;
}): Promise<{ properties: Property[]; isMongoDb: boolean }> {
  const dbStatus = await connectToDatabase();

  if (dbStatus.isConnected) {
    try {
      // Auto-seed initial catalog into MongoDB if empty
      const count = await PropertyModel.countDocuments();
      if (count === 0) {
        await PropertyModel.insertMany(
          ADRON_PROPERTIES.map((p) => ({
            ...p,
            slug: p.slug || p.id,
          }))
        );
      }

      const queryObj: any = {};

      if (filters?.query) {
        const regex = new RegExp(filters.query, "i");
        queryObj.$or = [
          { name: regex },
          { location: regex },
          { city: regex },
          { state: regex },
          { description: regex },
        ];
      }

      if (filters?.state && filters.state !== "all") {
        queryObj.state = new RegExp(`^${filters.state}$`, "i");
      }

      if (filters?.type && filters.type !== "all") {
        queryObj.type = filters.type;
      }

      if (filters?.maxPrice && filters.maxPrice > 0) {
        queryObj.$or = [
          { promoStartingPrice: { $lte: filters.maxPrice } },
          { startingPrice: { $lte: filters.maxPrice } },
        ];
      }

      if (filters?.featured) {
        queryObj.featured = true;
      }

      const docs = await PropertyModel.find(queryObj).lean();
      const properties: Property[] = docs.map((doc: any) => ({
        id: doc.slug || doc._id.toString(),
        slug: doc.slug,
        name: doc.name,
        tagline: doc.tagline,
        location: doc.location,
        city: doc.city,
        state: doc.state,
        type: doc.type,
        status: doc.status,
        titleDocument: doc.titleDocument,
        discountPercentage: doc.discountPercentage,
        startingPrice: doc.startingPrice,
        promoStartingPrice: doc.promoStartingPrice,
        minInitialDeposit: doc.minInitialDeposit,
        description: doc.description,
        features: doc.features || [],
        amenities: doc.amenities || [],
        images: doc.images || [],
        featured: doc.featured || false,
        plotOptions: doc.plotOptions || [],
        paymentPlans: doc.paymentPlans || [],
        coordinates: doc.coordinates,
        address: doc.address,
      }));

      return { properties, isMongoDb: true };
    } catch (err) {
      // Local fallback
    }
  }

  // Fallback to in-memory ADRON_PROPERTIES
  let results = [...ADRON_PROPERTIES];
  if (filters) {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (filters.state && filters.state !== "all") {
      results = results.filter((p) => p.state.toLowerCase() === filters.state?.toLowerCase());
    }
    if (filters.type && filters.type !== "all") {
      results = results.filter((p) => p.type === filters.type);
    }
    if (filters.maxPrice && filters.maxPrice > 0) {
      results = results.filter((p) => (p.promoStartingPrice || p.startingPrice) <= filters.maxPrice!);
    }
    if (filters.featured) {
      results = results.filter((p) => p.featured);
    }
  }

  return { properties: results, isMongoDb: false };
}

export async function fetchPropertyById(id: string): Promise<Property | undefined> {
  const dbStatus = await connectToDatabase();

  if (dbStatus.isConnected) {
    try {
      const doc: any = await PropertyModel.findOne({
        $or: [{ slug: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      }).lean();

      if (doc) {
        return {
          id: doc.slug || doc._id.toString(),
          slug: doc.slug,
          name: doc.name,
          tagline: doc.tagline,
          location: doc.location,
          city: doc.city,
          state: doc.state,
          type: doc.type,
          status: doc.status,
          titleDocument: doc.titleDocument,
          discountPercentage: doc.discountPercentage,
          startingPrice: doc.startingPrice,
          promoStartingPrice: doc.promoStartingPrice,
          minInitialDeposit: doc.minInitialDeposit,
          description: doc.description,
          features: doc.features || [],
          amenities: doc.amenities || [],
          images: doc.images || [],
          featured: doc.featured || false,
          plotOptions: doc.plotOptions || [],
          paymentPlans: doc.paymentPlans || [],
          coordinates: doc.coordinates,
          address: doc.address,
        };
      }
    } catch (err) {
      // Local fallback
    }
  }

  return ADRON_PROPERTIES.find((p) => p.id === id || p.slug === id);
}
