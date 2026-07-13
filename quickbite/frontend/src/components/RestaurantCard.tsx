import React from "react";
import { Star, Clock, MapPin } from "lucide-react";
import { Restaurant } from "../types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  key?: number;
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm">
          {restaurant.cuisine}
        </div>
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
          <Clock size={12} className="text-orange-400" />
          <span>{restaurant.deliveryTime}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors duration-200">
            {restaurant.name}
          </h3>
          <div className="flex items-center space-x-1 text-amber-500 font-semibold text-sm">
            <Star size={14} fill="currentColor" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-4 flex-grow font-light">
          {restaurant.description}
        </p>

        <div className="pt-4 border-t border-slate-50 flex items-center space-x-1.5 text-xs text-slate-400">
          <MapPin size={12} className="text-slate-400" />
          <span className="truncate">{restaurant.location}</span>
        </div>
      </div>
    </div>
  );
}
