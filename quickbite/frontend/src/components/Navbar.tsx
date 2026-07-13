import React from "react";
import { ShoppingBag, Utensils, MapPin } from "lucide-react";
import { CartItem } from "../types";

interface NavbarProps {
  cart: CartItem[];
  onNavigate: (view: "home" | "restaurants" | "checkout") => void;
  currentView: string;
}

export default function Navbar({ cart, onNavigate, currentView }: NavbarProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center space-x-2 text-slate-900 font-bold text-2xl tracking-tight cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 transform hover:scale-105 transition-transform duration-200">
            <Utensils size={20} />
          </div>
          <span>
            Quick<span className="text-orange-600">Bite</span>
          </span>
        </button>

        {/* Location Indicator */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs text-slate-600">
          <MapPin size={14} className="text-orange-600" />
          <span className="font-medium text-slate-700">Delivering to:</span>
          <span>Foodville Downtown</span>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate("restaurants")}
            className={`text-sm font-medium transition-colors ${
              currentView === "restaurants" ? "text-orange-600 font-semibold" : "text-slate-600 hover:text-orange-600"
            }`}
          >
            Browse Restaurants
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={() => onNavigate("checkout")}
            className="relative flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 active:scale-95 transition-all duration-200 shadow-sm"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
