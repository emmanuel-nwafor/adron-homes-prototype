import mongoose, { Schema, Document, Model } from "mongoose";
import { Property } from "@/types/property";

export interface IPropertyDocument extends Omit<Property, "id">, Document {}

const PlotOptionSchema = new Schema({
  sizeSqm: { type: Number, required: true },
  label: { type: String, required: true },
  outrightPrice: { type: Number, required: true },
  promoPrice: { type: Number },
});

const PaymentPlanOptionSchema = new Schema({
  durationMonths: { type: Number, required: true },
  label: { type: String, required: true },
  initialDeposit: { type: Number, required: true },
  monthlyAmount: { type: Number, required: true },
  dailyEquivalent: { type: Number },
  totalPrice: { type: Number, required: true },
});

const PropertySchema = new Schema<IPropertyDocument>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    type: { type: String, enum: ["land", "residential", "commercial"], required: true },
    status: { type: String, required: true },
    titleDocument: { type: String, required: true },
    discountPercentage: { type: Number },
    startingPrice: { type: Number, required: true },
    promoStartingPrice: { type: Number },
    minInitialDeposit: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    amenities: [{ type: String }],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    plotOptions: [PlotOptionSchema],
    paymentPlans: [PaymentPlanOptionSchema],
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export const PropertyModel: Model<IPropertyDocument> =
  mongoose.models.Property || mongoose.model<IPropertyDocument>("Property", PropertySchema);
