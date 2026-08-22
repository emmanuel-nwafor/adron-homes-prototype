"use client";

import { useState } from "react";
import { X, CheckCircle2, Building2, Calendar, Phone, Mail, User, HelpCircle } from "lucide-react";
import { Property } from "@/types/property";

interface EnquiryModalProps {
  property?: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EnquiryModal({ property, isOpen, onClose }: EnquiryModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          preferredInspectionDate: inspectionDate,
          message: question,
          propertyId: property?.id,
          propertyTitle: property?.name || "General Estate Enquiry",
          leadSource: "Adron Web Prototype Lead Form",
        }),
      });

      const json = await res.json();

      if (json.success) {
        setSubmittedMessage(json.message || "Thank you! An Adron Sales Executive will contact you shortly.");
        setTimeout(() => {
          setSubmittedMessage(null);
          setFullName("");
          setPhone("");
          setEmail("");
          setInspectionDate("");
          setQuestion("");
          onClose();
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-zinc-900 dark:text-zinc-100 animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-aclonica text-zinc-950 dark:text-white">
              {property ? `Enquire about ${property.name}` : "Make an Estate Enquiry"}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Get detailed pricing breakdown, C of O verification & book site tours.
            </p>
          </div>
        </div>

        {submittedMessage ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 p-6 rounded-2xl text-xs space-y-2 text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base text-emerald-700 dark:text-emerald-300">Enquiry Received!</h4>
            <p>{submittedMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Babatunde Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  WhatsApp Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="08012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="babatunde@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Preferred Free Tour Inspection Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-600 text-zinc-700 dark:text-zinc-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Your Question or Custom Request
              </label>
              <textarea
                rows={3}
                placeholder="Ask about 36-month payment plans, instant plot allocation, or discounts..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-full transition-all shadow-md shadow-emerald-600/20 font-aclonica cursor-pointer"
            >
              {isSubmitting ? "Transmitting Lead..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
