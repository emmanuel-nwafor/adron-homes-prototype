import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChatMessageDocument extends Document {
  sessionId: string;
  sender: "user" | "assistant" | "system";
  text: string;
  suggestedActions?: string[];
  relatedPropertyIds?: string[];
  isWebhookResponse: boolean;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessageDocument>(
  {
    sessionId: { type: String, required: true, index: true },
    sender: { type: String, enum: ["user", "assistant", "system"], required: true },
    text: { type: String, required: true },
    suggestedActions: [{ type: String }],
    relatedPropertyIds: [{ type: String }],
    isWebhookResponse: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ChatMessageModel: Model<IChatMessageDocument> =
  mongoose.models.ChatMessage || mongoose.model<IChatMessageDocument>("ChatMessage", ChatMessageSchema);
