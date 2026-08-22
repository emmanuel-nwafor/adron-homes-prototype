import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiryDocument extends Document {
  title?: string;
  fullName: string;
  email?: string;
  phone: string;
  referredByMarketer?: boolean;
  propertyId?: string;
  propertyTitle?: string;
  preferredInspectionDate?: string;
  message?: string;
  leadSource?: string;
  status: "new" | "contacted" | "inspection_scheduled" | "subscribed" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiryDocument>(
  {
    title: { type: String },
    fullName: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    referredByMarketer: { type: Boolean, default: false },
    propertyId: { type: String },
    propertyTitle: { type: String },
    preferredInspectionDate: { type: String },
    message: { type: String },
    leadSource: { type: String, default: "Adron Web Prototype" },
    status: {
      type: String,
      enum: ["new", "contacted", "inspection_scheduled", "subscribed", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const EnquiryModel: Model<IEnquiryDocument> =
  mongoose.models.Enquiry || mongoose.model<IEnquiryDocument>("Enquiry", EnquirySchema);
