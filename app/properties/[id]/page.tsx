"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { EnquiryModal } from "@/components/enquiry-modal";
import { getPropertyById } from "@/lib/data/properties";
import {
  ArrowLeft,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  HelpCircle,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
} from "lucide-react";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPlotIndex, setSelectedPlotIndex] = useState(0);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Direct form submission state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const currentPlot = property.plotOptions[selectedPlotIndex] || property.plotOptions[0];
  const currentPlan = property.paymentPlans[selectedPlanIndex] || property.paymentPlans[0];

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    setSubmitSuccess(null);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          preferredInspectionDate: inspectionDate,
          propertyId: property.id,
          propertyTitle: property.name,
          message: `Interested in plot size: ${currentPlot.label} with payment plan: ${currentPlan.label}`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSubmitSuccess(json.message || "Enquiry submitted! An Adron representative will contact you.");
        setFullName("");
        setPhone("");
        setEmail("");
        setInspectionDate("");
      }
    } catch (err) {
      // Submission error fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      {/* Top Breadcrumb Header */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/properties"
            className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Estates
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-lime-500/10 text-lime-700 dark:text-lime-400 px-3 py-1 rounded-full border border-lime-500/30 font-bold">
              {property.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-lime-600 dark:text-lime-400 font-semibold mb-2">
              <MapPin className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>{property.location}, {property.state} State</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white font-aclonica">{property.name}</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">{property.tagline}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl text-right shadow-sm">
            <span className="text-xs text-zinc-500 block font-mono">Promo Starting Price:</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-aclonica">
              ₦{(property.promoStartingPrice || property.startingPrice).toLocaleString()}
            </span>
            {property.discountPercentage && (
              <span className="block text-xs text-red-600 font-bold mt-0.5">
                Save {property.discountPercentage}% off regular listing price
              </span>
            )}
          </div>
        </div>

        {/* Gallery & Quick Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Gallery */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative h-[380px] sm:h-[480px] w-full rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-md">
              <Image
                src={property.images[activeImageIndex]}
                alt={property.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-black/80 backdrop-blur text-lime-400 border border-lime-500/40 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-4 h-4" /> {property.titleDocument}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? "border-lime-500 scale-105" : "border-zinc-300 dark:border-zinc-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description & Infrastructure Features */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-3 font-aclonica">About {property.name}</h3>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-lime-600 dark:text-lime-400 mb-3 uppercase tracking-wider font-aclonica">
                  Estate Infrastructure & Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-zinc-50 dark:bg-zinc-950/80 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Plot Calculator & Inspection Booking */}
          <div className="lg:col-span-4 space-y-6">
            {/* Plot Size Selector */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-5 shadow-sm">
              <h3 className="font-bold text-zinc-950 dark:text-white text-base flex items-center justify-between font-aclonica">
                <span>Select Plot Size</span>
                <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              </h3>

              <div className="space-y-2">
                {property.plotOptions.map((plot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPlotIndex(i)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedPlotIndex === i
                        ? "bg-lime-500/10 border-lime-500 text-zinc-950 dark:text-white font-bold"
                        : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block text-zinc-950 dark:text-white">{plot.label}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">Outright Promo</span>
                    </div>
                    <span className="text-sm font-extrabold text-lime-600 dark:text-lime-400 font-aclonica">
                      ₦{(plot.promoPrice || plot.outrightPrice).toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>

              {/* Payment Schedule */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Choose Installment Duration:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {property.paymentPlans.map((plan, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPlanIndex(i)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                        selectedPlanIndex === i
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold"
                          : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {plan.label}
                    </button>
                  ))}
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Initial Deposit:</span>
                    <strong className="text-zinc-950 dark:text-white">₦{currentPlan.initialDeposit.toLocaleString()}</strong>
                  </div>
                  {currentPlan.monthlyAmount > 0 && (
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Monthly Installment:</span>
                      <strong className="text-lime-600 dark:text-lime-400 font-mono">₦{currentPlan.monthlyAmount.toLocaleString()}/mo</strong>
                    </div>
                  )}
                  {currentPlan.dailyEquivalent && currentPlan.dailyEquivalent > 0 ? (
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-900">
                      <span>Daily Equivalent:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono">₦{currentPlan.dailyEquivalent.toLocaleString()}/day</strong>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Make Enquiry Button */}
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="w-full bg-lime-600 hover:bg-lime-700 text-white font-extrabold text-xs py-3.5 rounded-full transition-all shadow-md shadow-lime-600/20 flex items-center justify-center gap-2 font-aclonica"
              >
                <HelpCircle className="w-4 h-4" /> Make Enquiry For This Plot
              </button>
            </div>
          </div>
        </div>
      </main>

      <ChatWidget initialPropertyTitle={property.name} initialPropertyId={property.id} />
      <EnquiryModal
        property={property}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
      <Footer />
    </div>
  );
}
