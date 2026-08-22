"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import { ChatWidget } from "@/components/chat-widget";
import { SubscribeModal } from "@/components/subscribe-modal";
import { HeroCarousel } from "@/components/hero-carousel";
import { GsapFadeIn, GsapStaggerContainer } from "@/components/gsap-animated";
import { ADRON_PROPERTIES } from "@/lib/data/properties";
import {
  ArrowRight,
  Bot,
  Building,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Gift,
  MapPin,
  Play,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function Home() {
  const [selectedState, setSelectedState] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [activeLocationIndex, setActiveLocationIndex] = useState(1);

  // Locations list matching reference screenshot
  const locations = [
    { name: "Lagos State", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80", count: "12 Estates" },
    { name: "Ogun State", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80", count: "18 Estates" },
    { name: "Abuja (FCT)", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", count: "8 Estates" },
    { name: "Oyo State", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", count: "6 Estates" },
  ];

  const filteredProperties = ADRON_PROPERTIES.filter((p) => {
    const matchState = selectedState === "all" || p.state.toLowerCase() === selectedState.toLowerCase();
    const matchType = selectedType === "all" || p.type === selectedType;
    const matchQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchState && matchType && matchQuery;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      {/* 1. Automated Hero Carousel Section */}
      <section className="pt-6 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950">
        <GsapFadeIn duration={0.9} y={30} className="max-w-7xl mx-auto space-y-8">
          <HeroCarousel />

          {/* 2. Stats Bar (Matched directly to reference screenshot) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center">
            <div>
              <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400 font-aclonica">100+</span>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Estates</span>
            </div>
            <div>
              <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400 font-aclonica">200K+</span>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Happy Clients</span>
            </div>
            <div>
              <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400 font-aclonica">3000+</span>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Sales Advisors</span>
            </div>
            <div>
              <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400 font-aclonica">70+</span>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Offices</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400 font-aclonica">14+</span>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Years of Trust</span>
            </div>
          </div>
        </GsapFadeIn>
      </section>

      {/* 3. Featured Spotlight Card (Sugarland Estate Spotlight) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <GsapFadeIn duration={0.8} y={30} className="relative rounded-3xl overflow-hidden h-[360px] sm:h-[420px] border border-zinc-200 dark:border-zinc-800 shadow-xl bg-zinc-900 group">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="Sugarland Estate"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 text-white space-y-3 z-10">
            <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full w-fit inline-block font-sans">
              🔥 Featured Launch
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-aclonica">Sugarland Estate</h2>
            <p className="text-xs sm:text-sm text-zinc-300 flex items-center gap-1 font-medium">
              <MapPin className="w-4 h-4 text-emerald-400" /> Shimawa, Ogun State Nigeria
            </p>
            <div className="pt-2">
              <Link
                href="/properties/eko-city-shimawa"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-6 rounded-full transition-all inline-flex items-center gap-2 font-aclonica shadow-lg shadow-emerald-600/30"
              >
                View Property Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </GsapFadeIn>
      </section>

      {/* 4. About Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <GsapFadeIn duration={0.9} y={30} className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 relative h-[320px] sm:h-[400px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80"
              alt="About Adron Homes"
              fill
              className="object-cover"
            />
          </div>

          <div className="md:col-span-7 space-y-4">
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Features</span>
            <h2 className="text-3xl font-black text-zinc-950 dark:text-white font-aclonica">About Us</h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Adron Homes and Properties Ltd is a Pan-African real estate company committed to providing suitable, modern, and affordable housing solutions for all classes of society across Nigeria and West Africa.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              With over 14 years of industry excellence, we offer 100% legal title documents (C of O, Excision, Gazette), instant physical allocation, and daily flexible payment plans designed to fit your unique financial goals.
            </p>
            <div className="pt-2">
              <Link
                href="/properties"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 px-8 rounded-full transition-all inline-block font-aclonica shadow-md shadow-emerald-600/20"
              >
                Read More
              </Link>
            </div>
          </div>
        </GsapFadeIn>
      </section>

      {/* 5. Discover Our Featured Properties Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Verified Land & Housing</span>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white font-aclonica">
            Discover Our Featured Properties
          </h2>
        </div>

        <GsapStaggerContainer stagger={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </GsapStaggerContainer>

        <div className="mt-12 text-center">
          <Link
            href="/properties"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-4 px-10 rounded-full transition-all inline-block font-aclonica shadow-lg shadow-emerald-600/30 hover:scale-105"
          >
            View All Properties
          </Link>
        </div>
      </section>

      {/* 6. Explore Our Estate Locations Slider */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-100 dark:bg-zinc-900/60 border-y border-zinc-200 dark:border-zinc-800">
        <GsapFadeIn duration={0.8} y={30} className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Prime Regions</span>
            <h2 className="text-3xl font-black text-zinc-950 dark:text-white font-aclonica">
              Explore Our Estate Locations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.slice(0, 3).map((loc, idx) => (
              <div
                key={idx}
                className="relative h-64 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md group cursor-pointer"
              >
                <Image src={loc.image} alt={loc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-xl font-bold font-aclonica">{loc.name}</h4>
                  <span className="text-xs text-emerald-400 font-semibold">{loc.count}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Pill Navigator */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveLocationIndex((prev) => (prev - 1 + locations.length) % locations.length)}
              className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 font-bold shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="bg-white dark:bg-zinc-800 px-6 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {locations[activeLocationIndex].name}
            </span>
            <button
              onClick={() => setActiveLocationIndex((prev) => (prev + 1) % locations.length)}
              className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 font-bold shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </GsapFadeIn>
      </section>

      {/* 7. Client Testimonial Video Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <GsapFadeIn duration={0.8} y={30} className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl font-black text-zinc-950 dark:text-white font-aclonica">Client Testimonials</h2>
          </div>

          <div className="max-w-3xl mx-auto bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 relative h-80 sm:h-96 shadow-2xl group cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
              alt="Client Testimonial"
              fill
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 text-white bg-black/60 backdrop-blur px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold">
              Client Testimonial | Treasure Park and Gardens (City of David)
            </div>
          </div>
        </GsapFadeIn>
      </section>

      {/* Floating AI Chat Assistant Widget */}
      <ChatWidget />

      {/* 2-Step Subscription Modal */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
