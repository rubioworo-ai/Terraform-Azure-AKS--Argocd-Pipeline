import React from "react";
import { ShoppingBag, MapPin, User } from "lucide-react";
import { CartItem } from "../types";

interface NavbarProps {
  cart: CartItem[];
  onNavigate: (view: "home" | "restaurants" | "checkout") => void;
  currentView: string;
}

export default function Navbar({ cart, onNavigate, currentView }: NavbarProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-50">
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="text-2xl font-black text-orange-600 tracking-tighter cursor-pointer focus:outline-none hover:opacity-90 transition-opacity"
          id="btn-navbar-logo"
        >
          QUICKBITE
        </button>

        {/* Location Indicator */}
        <div className="hidden md:flex items-center space-x-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
          <MapPin size={12} className="text-orange-600" />
          <span className="text-xs font-semibold text-gray-600">Delivering to: 123 Maple Avenue</span>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onNavigate("restaurants")}
          className={`text-xs uppercase tracking-wider font-bold transition-colors ${
            currentView === "restaurants" ? "text-orange-600" : "text-gray-500 hover:text-orange-600"
          }`}
          id="btn-nav-restaurants"
        >
          Browse Restaurants
        </button>

        {/* Cart Button */}
        <button
          onClick={() => onNavigate("checkout")}
          className="relative flex items-center space-x-1.5 bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-700 active:scale-95 transition-all shadow-sm"
          id="btn-nav-cart"
        >
          <ShoppingBag size={14} />
          <span>Basket</span>
          {totalItems > 0 && (
            <span className="bg-white text-orange-600 text-[10px] font-black px-1.5 py-0.2 rounded">
              {totalItems}
            </span>
          )}
        </button>

        {/* Profile indicator */}
        <div className="hidden sm:flex items-center space-x-2 border-l border-gray-200 pl-4">
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-semibold leading-none">Welcome back</div>
            <div className="text-xs font-extrabold text-gray-800">Alex Johnson</div>
          </div>
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">
            AJ
          </div>
        </div>
      </div>
    </header>
  );
}
