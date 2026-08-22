import Link from "next/link";
import { Bot, Building2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-600/20 font-aclonica">
                A
              </div>
              <span className="font-aclonica text-lg tracking-tight text-zinc-950 dark:text-white">
                ADRON <span className="text-emerald-600 dark:text-emerald-400">HOMES</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Adron Homes & Properties is Africa’s leading real estate development company dedicated to making housing accessible, secure, and affordable with incredible discounts and super flexible payment options.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>100% Legal Title Documents Guaranteed</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-zinc-950 dark:text-white mb-4 text-base font-aclonica">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/properties" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  All Estates Showcase
                </Link>
              </li>
              <li>
                <Link href="/properties?state=Lagos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Lagos Estates (Ibeju-Lekki & Epe)
                </Link>
              </li>
              <li>
                <Link href="/properties?state=Ogun" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Ogun Estates (Shimawa & Atan-Ota)
                </Link>
              </li>
              <li>
                <Link href="/properties?state=Abuja" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Abuja Estates (Karu Corridor)
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" /> AI Customer Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Office Locations */}
          <div>
            <h4 className="font-bold text-zinc-950 dark:text-white mb-4 text-base font-aclonica">Regional Offices</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Headquarters</strong>: 75B, Opebi Road, Ikeja, Lagos State, Nigeria.</span>
              </li>
              <li className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Abuja Office</strong>: Plot 102, Aminu Kano Crescent, Wuse 2, Abuja.</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Ibadan Office</strong>: Ring Road Axis, Ibadan, Oyo State.</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-bold text-zinc-950 dark:text-white mb-4 text-base font-aclonica">Customer Care</h4>
            <div className="space-y-3 text-xs">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>+234 800 237 6663 (Toll Free)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>customercare@adronhomesproperties.com</span>
              </p>
              <div className="pt-2">
                <p className="text-zinc-500 font-mono text-[11px] mb-1">AI Assistant Status:</p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  AI Service Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-900 text-center text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Adron Homes & Properties Ltd. All rights reserved.</p>
          <p className="text-zinc-500">Built as an executive prototype for corporate pitch presentation.</p>
        </div>
      </div>
    </footer>
  );
}
