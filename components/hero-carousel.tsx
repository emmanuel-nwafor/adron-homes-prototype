"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Tag } from "lucide-react";
import { SubscribeModal } from "./subscribe-modal";

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  highlightText: string;
  description: string;
  image: string;
  discountTag?: string;
  ctaText: string;
  ctaLink: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide_1",
    badge: "LEMON FRIDAY PLUS PROMO • BUILD ON EASE",
    title: "Own A Home In Comfort.",
    highlightText: "Pay With Ease!",
    description: "Enjoy up to 30% to 50% DISCOUNT on all Adron Homes verified estate plots across Nigeria with flexible initial deposit starting from ₦50,000.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    discountTag: "30% OFF PROMO",
    ctaText: "Explore Promo Estates",
    ctaLink: "/properties",
  },
  {
    id: "slide_2",
    badge: "MEGA ECO SMART CITY • SHIMAWA OGUN",
    title: "Welcome to Eko City,",
    highlightText: "City of David Phase 2",
    description: "Located right behind Redemption Camp. Instant physical plot allocation, C of O title documentation, and solar-powered street infrastructure.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
    discountTag: "C of O TITLE",
    ctaText: "View Eko City Estate",
    ctaLink: "/properties/eko-city-shimawa",
  },
  {
    id: "slide_3",
    badge: "ABUJA METROPOLITAN EXPANSION CORRIDOR",
    title: "Metropolitan Luxury,",
    highlightText: "Manhattan Park Abuja",
    description: "Experience premium architectural serenity in Karu, Abuja. Flexible 36-month payment terms with equal convenient monthly installments.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    discountTag: "50% DISCOUNT",
    ctaText: "View Abuja Estates",
    ctaLink: "/properties/manhattan-park-gardens",
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    startTimer();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    startTimer();
  };

  const activeSlide = HERO_SLIDES[currentIndex];

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white min-h-[440px] sm:min-h-[480px] flex flex-col justify-center p-6 sm:p-14 group">
        {/* Background Images Cross-Fade */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-35 z-0" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover scale-105 transition-transform duration-[6000ms] ease-out"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-transparent z-1" />

        {/* Slide Content */}
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1 rounded-full text-emerald-300 text-xs font-bold backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{activeSlide.badge}</span>
            </div>

            {activeSlide.discountTag && (
              <span className="bg-red-600/90 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <Tag className="w-3 h-3" /> {activeSlide.discountTag}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-aclonica">
            {activeSlide.title} <br />
            <span className="text-emerald-400">{activeSlide.highlightText}</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
            {activeSlide.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={activeSlide.ctaLink}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-8 rounded-full transition-all shadow-xl shadow-emerald-600/30 hover:scale-105 font-aclonica flex items-center gap-2"
            >
              {activeSlide.ctaText} <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsSubscribeModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs py-3.5 px-8 rounded-full transition-all backdrop-blur font-aclonica cursor-pointer"
            >
              Subscribe Now
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur flex items-center justify-center border border-white/20 transition-all z-20 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur flex items-center justify-center border border-white/20 transition-all z-20 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                startTimer();
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-emerald-400" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2-Step Subscribe Modal */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />
    </>
  );
}
