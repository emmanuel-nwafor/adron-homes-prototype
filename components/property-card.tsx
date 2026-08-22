"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { SubscribeModal } from "./subscribe-modal";
import { ChevronLeft, ChevronRight, Heart, MapPin, Tag } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const images = property.images && property.images.length > 0 ? property.images : [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
  ];

  const displayPrice = property.promoStartingPrice || property.startingPrice;
  const originalPrice = property.promoStartingPrice ? property.startingPrice : null;

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const mainPlot = property.plotOptions[0] || { sizeSqm: 500 };

  return (
    <>
      <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between text-zinc-900 dark:text-zinc-100">
        <div>
          {/* Image Container with In-Card Carousel */}
          <div className="relative h-56 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 p-2">
            <div className="relative h-full w-full rounded-2xl overflow-hidden">
              <Image
                src={images[currentImgIndex]}
                alt={property.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              {/* Carousel Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/60 text-zinc-900 dark:text-white backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/60 text-zinc-900 dark:text-white backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </>
              )}

              {/* Top-Right Red Pill Discount Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 font-sans">
                  <Tag className="w-3 h-3" /> {property.discountPercentage || 30}% off
                </span>
              </div>

              {/* Legal Title Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-black/70 backdrop-blur text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {property.titleDocument.split(" ")[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-5 space-y-3">
            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold font-aclonica tracking-tight text-zinc-950 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {property.name}
            </h3>

            {/* Location Line */}
            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="line-clamp-1">{property.location}, {property.state} Nigeria</span>
            </div>

            {/* Price Row & Favorite Heart */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-aclonica">
                  ₦{displayPrice.toLocaleString()}
                </span>
                {originalPrice && (
                  <span className="text-xs text-zinc-400 line-through font-mono">
                    ₦{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <button
                onClick={() => setIsLiked(!isLiked)}
                aria-label="Save property"
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isLiked
                      ? "fill-emerald-600 text-emerald-600"
                      : "text-emerald-600 hover:fill-emerald-600/20"
                  }`}
                />
              </button>
            </div>

            {/* Specs Row */}
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 pt-1 font-medium">
              <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-lg">
                📐 {mainPlot.sizeSqm} SqM
              </span>
              <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-lg">
                ↔️ {property.amenities[0] || "Infrastructure"}
              </span>
            </div>

            {/* Payment Duration */}
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-1 font-medium">
              Payment Duration: <strong className="text-zinc-800 dark:text-zinc-200">36 month(s) max</strong>
            </div>
          </div>
        </div>

        {/* CTA Buttons Row (View Property & Subscribe) */}
        <div className="p-5 pt-0 grid grid-cols-2 gap-3">
          <Link
            href={`/properties/${property.id}`}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-full transition-all text-center shadow-md shadow-emerald-600/20 hover:scale-[1.02] flex items-center justify-center font-aclonica"
          >
            View Property
          </Link>
          <button
            onClick={() => setIsSubscribeModalOpen(true)}
            className="w-full bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 hover:border-emerald-600 dark:hover:border-emerald-500 font-bold text-xs py-2.5 px-4 rounded-full transition-all text-center flex items-center justify-center font-aclonica cursor-pointer"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* 2-Step Subscribe Modal */}
      <SubscribeModal
        property={property}
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />
    </>
  );
}
