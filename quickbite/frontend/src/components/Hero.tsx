import React from "react";
import { ArrowRight, Sparkles, Compass } from "lucide-react";

interface HeroProps {
  onBrowseClick: () => void;
}

export default function Hero({ onBrowseClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-slate-950 rounded-3xl my-6 mx-4 sm:mx-6 lg:mx-8 shadow-xl">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-12 sm:py-20 text-center flex flex-col items-center z-10">
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider animate-pulse">
          <Sparkles size={12} />
          <span>Speedy Delivery Assured</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none mb-4">
          Delicious Food <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
            Delivered
          </span>
        </h1>

        <p className="max-w-xl text-slate-400 text-sm sm:text-base mb-8 font-light">
          Craving your favorite meals? Order hot and fresh food from top-rated restaurants near you and enjoy lightning-fast, contact-free delivery straight to your doorstep.
        </p>

        <button
          onClick={onBrowseClick}
          className="group relative flex items-center space-x-2 bg-orange-600 text-white font-medium px-8 py-4 rounded-2xl overflow-hidden hover:bg-orange-700 active:scale-95 shadow-lg shadow-orange-600/30 transition-all duration-200 cursor-pointer"
        >
          <Compass size={18} className="group-hover:rotate-12 transition-transform duration-300" />
          <span>Browse Restaurants</span>
          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
