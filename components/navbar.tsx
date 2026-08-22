"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Bot, Home, MapPin, Menu, Phone, X, HelpCircle } from "lucide-react";
import { EnquiryModal } from "./enquiry-modal";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform font-aclonica">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-aclonica text-lg tracking-tight text-zinc-950 dark:text-white flex items-center gap-1">
                  ADRON <span className="text-emerald-600 dark:text-emerald-400">HOMES</span>
                </span>
                <span className="text-[9px] text-zinc-500 dark:text-zinc-400 tracking-wider font-semibold uppercase">
                  Building Incredible Cities
                </span>
              </div>
            </Link>

            {/* Streamlined Desktop Navigation (Calculator Removed) */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link
                href="/"
                className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link
                href="/properties"
                className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4" /> Estates
              </Link>
              <Link
                href="/chat"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1.5 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20"
              >
                <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> AI Assistant
              </Link>
            </nav>

            {/* Action Bar */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />

              <a
                href="tel:+2348002376663"
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors mr-1"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>0800-ADRON</span>
              </a>

              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4.5 py-2 rounded-full text-xs transition-all shadow-md shadow-emerald-600/20 hover:scale-105 flex items-center gap-1.5 font-aclonica cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" /> Make Enquiry
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 pt-2 pb-6 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 font-medium"
            >
              Estates Catalog
            </Link>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 font-aclonica"
            >
              <Bot className="w-5 h-5" /> Adron AI Assistant
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsEnquiryModalOpen(true);
              }}
              className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-full text-xs mt-2 font-aclonica"
            >
              Make Enquiry
            </button>
          </div>
        )}
      </header>

      {/* General Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </>
  );
}
