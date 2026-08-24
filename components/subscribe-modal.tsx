"use client";

import { useState } from "react";
import { X, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Property } from "@/types/property";

interface SubscribeModalProps {
  property?: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeModal({ property, isOpen, onClose }: SubscribeModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [referredByMarketer, setReferredByMarketer] = useState<"yes" | "no" | null>(null);

  // Step 2 Form State
  const [title, setTitle] = useState("Mr");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const estateName = property ? property.name : "Adron Estate";

  const handleStep1Proceed = () => {
    if (referredByMarketer === null) return;
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    setSuccessMessage(null);
    const activeSessionId = sessionStorage.getItem("adron_chat_session_id") || `session_${Date.now()}`;

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId,
          isSubscription: true,
          title,
          fullName: `${title} ${fullName}`.trim(),
          email,
          phone,
          referredByMarketer: referredByMarketer === "yes",
          propertyId: property?.id,
          propertyTitle: property?.name || "Adron Homes Subscription",
          message: `Subscription lead for ${estateName}. Referred by marketer: ${referredByMarketer}`,
          leadSource: "Adron Web Prototype Subscription",
        }),
      });

      const json = await res.json();

      if (json.success) {
        setSuccessMessage(json.message || "Subscription details recorded in Adron CRM!");
        setTimeout(() => {
          setSuccessMessage(null);
          setStep(1);
          setReferredByMarketer(null);
          setFullName("");
          setPhone("");
          setEmail("");
          onClose();
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-zinc-900 dark:text-zinc-100">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => {
              if (step === 2) setStep(1);
              else onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Title */}
        <h3 className="text-xl sm:text-2xl font-black font-aclonica text-zinc-950 dark:text-white tracking-tight mb-6">
          Subscribe to {estateName}
        </h3>

        {/* Success Alert */}
        {successMessage ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 p-6 rounded-2xl text-xs space-y-2 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base text-emerald-700 dark:text-emerald-300">Subscription Successful!</h4>
            <p>{successMessage}</p>
          </div>
        ) : step === 1 ? (
          /* STEP 1: Marketer Referral Question */
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Were you referred by a Marketer?
              </label>

              {/* Option: Yes */}
              <button
                type="button"
                onClick={() => setReferredByMarketer("yes")}
                className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  referredByMarketer === "yes"
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-500/10 text-zinc-950 dark:text-white font-bold"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  referredByMarketer === "yes" ? "border-emerald-600 bg-emerald-600 text-white" : "border-zinc-400"
                }`}>
                  {referredByMarketer === "yes" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-xs font-semibold">Yes</span>
              </button>

              {/* Option: No */}
              <button
                type="button"
                onClick={() => setReferredByMarketer("no")}
                className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  referredByMarketer === "no"
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-500/10 text-zinc-950 dark:text-white font-bold"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  referredByMarketer === "no" ? "border-emerald-600 bg-emerald-600 text-white" : "border-zinc-400"
                }`}>
                  {referredByMarketer === "no" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-xs font-semibold">No</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="bg-zinc-800 hover:bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={referredByMarketer === null}
                onClick={handleStep1Proceed}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 font-aclonica"
              >
                Proceed <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Subscriber Form */
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4 sm:col-span-3">
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Title
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs px-3 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Chief">Chief</option>
                  <option value="Engr">Engr</option>
                </select>
              </div>

              <div className="col-span-8 sm:col-span-9">
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Full name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                What is your email address *
              </label>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                What is your phone number *
              </label>
              <input
                type="tel"
                required
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-black hover:bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 font-aclonica"
              >
                {isSubmitting ? "Submitting..." : "Proceed"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
