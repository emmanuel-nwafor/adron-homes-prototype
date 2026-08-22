"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import { ChatWidget } from "@/components/chat-widget";
import { ADRON_PROPERTIES } from "@/lib/data/properties";
import { Filter, MapPin, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTitle, setSelectedTitle] = useState("all");
  const [maxPrice, setMaxPrice] = useState(30000000);

  const filtered = useMemo(() => {
    return ADRON_PROPERTIES.filter((p) => {
      const price = p.promoStartingPrice || p.startingPrice;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase());

      const matchState = selectedState === "all" || p.state.toLowerCase() === selectedState.toLowerCase();
      const matchType = selectedType === "all" || p.type === selectedType;
      const matchTitle = selectedTitle === "all" || p.titleDocument.includes(selectedTitle);
      const matchPrice = price <= maxPrice;

      return matchSearch && matchState && matchType && matchTitle && matchPrice;
    });
  }, [search, selectedState, selectedType, selectedTitle, maxPrice]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white font-aclonica">Adron Estates Catalog</h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl">
            Browse our full portfolio of verified land plots and modern residential estates across Lagos, Ogun, Abuja, and Oyo State.
          </p>
        </div>
      </div>

      {/* Filter and Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 h-fit space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-zinc-950 dark:text-white text-sm flex items-center gap-2 font-aclonica">
                <SlidersHorizontal className="w-4 h-4 text-lime-600 dark:text-lime-400" /> Filter Inventory
              </h3>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedState("all");
                  setSelectedType("all");
                  setSelectedTitle("all");
                  setMaxPrice(30000000);
                }}
                className="text-[11px] text-lime-600 dark:text-lime-400 hover:underline font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Search Keyword</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Estate name or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white pl-8 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-lime-500"
                />
              </div>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">State / Region</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-lime-500"
              >
                <option value="all">All States</option>
                <option value="Lagos">Lagos State</option>
                <option value="Ogun">Ogun State</option>
                <option value="Abuja">Abuja (FCT)</option>
                <option value="Oyo">Oyo State</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Property Category</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-lime-500"
              >
                <option value="all">All Types</option>
                <option value="land">Land Plots</option>
                <option value="residential">Residential Housing Units</option>
              </select>
            </div>

            {/* Title Document */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Legal Title Type</label>
              <select
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-lime-500"
              >
                <option value="all">All Title Types</option>
                <option value="Certificate of Occupancy">Certificate of Occupancy (C of O)</option>
                <option value="Excision">Approved Excision</option>
                <option value="Registered Survey">Registered Survey & Deed</option>
              </select>
            </div>

            {/* Max Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Max Price Cap</label>
                <span className="text-xs font-bold text-lime-600 dark:text-lime-400 font-mono">
                  ₦{(maxPrice / 1000000).toFixed(1)}M
                </span>
              </div>
              <input
                type="range"
                min={3000000}
                max={30000000}
                step={1000000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-lime-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs shadow-sm">
              <span className="text-zinc-600 dark:text-zinc-400">
                Showing <strong className="text-zinc-950 dark:text-white">{filtered.length}</strong> available estates
              </span>
              <span className="text-lime-600 dark:text-lime-400 font-mono text-[11px] font-bold">Promo Discounts Active</span>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-3 shadow-sm">
                <Filter className="w-10 h-10 text-zinc-400 mx-auto" />
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-aclonica">No Estates Found</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  No properties matched your exact filter combination. Try resetting filters or expanding your price cap.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatWidget />
      <Footer />
    </div>
  );
}
