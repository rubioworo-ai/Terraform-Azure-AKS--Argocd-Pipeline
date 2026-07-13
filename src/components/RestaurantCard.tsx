import React from "react";
import { Star, Clock, MapPin } from "lucide-react";
import { Restaurant } from "../types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  key?: number;
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  // Map standard rating color or badges
  const ratingText = restaurant.rating.toFixed(1);

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-orange-500 transition-all duration-200 cursor-pointer flex flex-col h-full"
      id={`restaurant-card-${restaurant.id}`}
    >
      {/* Restaurant Image */}
      <div className="relative w-full h-32 overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-gray-800 uppercase tracking-wider">
          {restaurant.cuisine}
        </div>
      </div>

      {/* High-Density Content */}
      <div className="p-3 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex justify-between items-start mb-1 gap-2">
            <h4 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition-colors duration-150 line-clamp-1">
              {restaurant.name}
            </h4>
            <span className="text-[10px] font-extrabold bg-green-100 text-green-700 px-1.5 py-0.5 rounded shrink-0">
              {ratingText} ★
            </span>
          </div>

          <p className="text-[11px] text-gray-500 line-clamp-2 mb-3 leading-relaxed font-light">
            {restaurant.description}
          </p>
        </div>

        <div className="flex justify-between text-[10px] font-semibold text-gray-400 pt-2 border-t border-gray-50">
          <span className="flex items-center space-x-1">
            <Clock size={10} className="text-gray-400" />
            <span>{restaurant.deliveryTime}</span>
          </span>
          <span className="flex items-center space-x-1 truncate max-w-[120px]">
            <MapPin size={10} className="text-gray-400" />
            <span className="truncate">{restaurant.location}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
