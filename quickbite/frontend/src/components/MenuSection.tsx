import React, { useState } from "react";
import { Star, Clock, MapPin, Plus, Minus, ShoppingBag, ArrowLeft, Heart } from "lucide-react";
import { Restaurant, Food, CartItem } from "../types";

interface MenuSectionProps {
  restaurant: Restaurant;
  menu: Food[];
  cart: CartItem[];
  onAddToCart: (food: Food) => void;
  onRemoveFromCart: (foodId: number) => void;
  onBack: () => void;
  onProceedToCheckout: () => void;
}

export default function MenuSection({
  restaurant,
  menu,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onBack,
  onProceedToCheckout
}: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(menu.map((item) => item.category)))];
  const filteredMenu = activeTab === "All" ? menu : menu.filter((item) => item.category === activeTab);

  const getQuantity = (foodId: number) => {
    const cartItem = cart.find((item) => item.food.id === foodId);
    return cartItem ? cartItem.quantity : 0;
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-slate-600 hover:text-orange-600 font-medium text-sm mb-6 transition-colors group cursor-pointer focus:outline-none"
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to Restaurants</span>
      </button>

      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-lg mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <img
          src={restaurant.image}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover blur-[1px] opacity-60"
        />

        <div className="relative z-20 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-orange-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {restaurant.cuisine}
              </span>
              <div className="flex items-center space-x-1 text-amber-400 font-semibold text-xs sm:text-sm">
                <Star size={14} fill="currentColor" />
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
              {restaurant.name}
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm font-light mb-4 leading-relaxed">
              {restaurant.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center space-x-1">
                <MapPin size={12} className="text-orange-500" />
                <span>{restaurant.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={12} className="text-orange-500" />
                <span>{restaurant.deliveryTime}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center">
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full text-white transition-colors">
              <Heart size={20} className="hover:text-red-500 transition-colors duration-200" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 border-b border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  activeTab === cat
                    ? "bg-orange-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredMenu.map((item) => {
              const qty = getQuantity(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 hover:shadow-sm transition-all duration-300"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-50 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-orange-600 font-bold text-sm shrink-0">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs line-clamp-2 sm:line-clamp-3 font-light leading-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-end items-center mt-3">
                      {qty > 0 ? (
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full py-1 px-1.5 space-x-3">
                          <button
                            onClick={() => onRemoveFromCart(item.id)}
                            className="w-6 h-6 rounded-full bg-white text-slate-700 hover:bg-orange-100 hover:text-orange-600 border border-slate-200/60 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-all"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-semibold text-slate-800 text-sm">{qty}</span>
                          <button
                            onClick={() => onAddToCart(item)}
                            className="w-6 h-6 rounded-full bg-white text-slate-700 hover:bg-orange-100 hover:text-orange-600 border border-slate-200/60 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-all"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="inline-flex items-center space-x-1 bg-slate-900 hover:bg-orange-600 text-white text-xs font-semibold py-1.5 px-3 rounded-full cursor-pointer shadow-sm active:scale-95 transition-all"
                        >
                          <Plus size={12} />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={18} className="text-orange-600" />
                <h3 className="font-bold text-slate-900">Your Order</h3>
              </div>
              <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {totalCartItems} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-3">
                  <ShoppingBag size={24} />
                </div>
                <p className="text-slate-400 text-sm font-light">Your basket is empty.</p>
              </div>
            ) : (
              <div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 mb-6">
                  {cart.map((item) => (
                    <div key={item.food.id} className="flex justify-between items-center text-sm gap-2">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="font-semibold text-orange-600 text-xs">{item.quantity}x</span>
                        <span className="text-slate-800 font-medium truncate">{item.food.name}</span>
                      </div>
                      <span className="text-slate-600 font-medium shrink-0">
                        ${(item.food.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4 mb-6 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>${totalCartPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold text-base pt-2 border-t border-slate-100">
                    <span>Total Price</span>
                    <span className="text-orange-600">${totalCartPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={onProceedToCheckout}
                  className="w-full bg-slate-900 hover:bg-orange-600 active:scale-98 text-white py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
