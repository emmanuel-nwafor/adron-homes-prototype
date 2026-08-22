export type PropertyType = "land" | "residential" | "commercial";
export type PropertyStatus = "Available" | "Fast Selling" | "Sold Out" | "New Launch";
export type TitleDocumentType = 
  | "Certificate of Occupancy (C of O)"
  | "Governor's Consent"
  | "Approved Excision"
  | "Gazette"
  | "Registered Survey & Deed";

export interface PlotOption {
  sizeSqm: number;
  label: string; // e.g., "300 sqm (Half Plot)", "500 sqm (Full Plot)"
  outrightPrice: number;
  promoPrice?: number;
}

export interface PaymentPlanOption {
  durationMonths: number;
  label: string; // e.g., "Outright (0-3 Months)", "12 Months Installment", "24 Months Installment", "36 Months Flexible"
  initialDeposit: number;
  monthlyAmount: number;
  dailyEquivalent?: number;
  totalPrice: number;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  location: string;
  city: string;
  state: string; // e.g. "Lagos", "Ogun", "Abuja", "Oyo", "Ekiti"
  type: PropertyType;
  status: PropertyStatus;
  titleDocument: TitleDocumentType;
  discountPercentage?: number;
  startingPrice: number;
  promoStartingPrice?: number;
  minInitialDeposit: number;
  description: string;
  features: string[];
  amenities: string[];
  images: string[];
  featured: boolean;
  plotOptions: PlotOption[];
  paymentPlans: PaymentPlanOption[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  address: string;
}

export interface EnquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  preferredInspectionDate?: string;
  message?: string;
  leadSource?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  relatedPropertyIds?: string[];
}

export interface N8nChatPayload {
  message: string;
  sessionId: string;
  userContext?: {
    propertyId?: string;
    propertyTitle?: string;
    device?: string;
  };
}

export interface N8nChatResponse {
  output?: string;
  reply?: string;
  message?: string;
  text?: string;
  suggestedActions?: string[];
  relatedPropertyIds?: string[];
}
