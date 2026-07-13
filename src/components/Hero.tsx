import React from "react";
import { ArrowRight, Sparkles, Compass } from "lucide-react";

interface HeroProps {
  onBrowseClick: () => void;
}

export default function Hero({ onBrowseClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gray-950 rounded-2xl my-4 mx-4 sm:mx-6 lg:mx-8 border border-gray-800 shadow-sm">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 py-10 sm:py-14 text-center flex flex-col items-center z-10">
        <div className="inline-flex items-center space-x-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 animate-pulse">
          <Sparkles size={10} />
          <span>Speedy Delivery Assured</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-none mb-3">
          DELICIOUS FOOD <br className="sm:hidden" />
          <span className="text-orange-500">
            DELIVERED
          </span>
        </h1>

        <p className="max-w-lg text-gray-400 text-xs sm:text-sm mb-6 font-light leading-relaxed">
          Craving your favorite meals? Order hot and fresh food from top-rated restaurants near you and enjoy lightning-fast, contact-free delivery straight to your doorstep.
        </p>

        <button
          onClick={onBrowseClick}
          className="group relative flex items-center space-x-2 bg-orange-600 text-white font-bold px-6 py-3 rounded-lg text-xs tracking-wider uppercase hover:bg-orange-700 active:scale-95 transition-all cursor-pointer shadow-sm"
          id="btn-hero-browse"
        >
          <Compass size={14} className="group-hover:rotate-12 transition-transform duration-300" />
          <span>Browse Restaurants</span>
          <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        {/* Dense statistical counters */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-10 pt-6 border-t border-gray-800 w-full max-w-lg text-center">
          <div className="px-2">
            <div className="text-lg sm:text-xl font-black text-white">20 MIN</div>
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Avg Delivery</div>
          </div>
          <div className="px-2 border-x border-gray-800">
            <div className="text-lg sm:text-xl font-black text-white">4.8 ★</div>
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Rating</div>
          </div>
          <div className="px-2">
            <div className="text-lg sm:text-xl font-black text-white">FREE</div>
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">On First Order</div>
          </div>
        </div>
      </div>
    </div>
  );
}
