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

  // Get categories from menu dynamically
  const categories = ["All", ...Array.from(new Set(menu.map((item) => item.category)))];

  const filteredMenu = activeTab === "All" ? menu : menu.filter((item) => item.category === activeTab);

  const getQuantity = (foodId: number) => {
    const cartItem = cart.find((item) => item.food.id === foodId);
    return cartItem ? cartItem.quantity : 0;
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-500 hover:text-orange-600 mb-4 transition-colors group cursor-pointer focus:outline-none"
        id="btn-menu-back"
      >
        <ArrowLeft size={12} className="transform group-hover:-translate-x-0.5 transition-transform duration-200" />
        <span>Back to Restaurants</span>
      </button>

      {/* High-Density Restaurant Banner Widget */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-orange-100 text-orange-600 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded">
                {restaurant.cuisine}
              </span>
              <span className="text-[10px] font-extrabold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                {restaurant.rating.toFixed(1)} ★
              </span>
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-xs text-gray-500 font-light mt-0.5 max-w-xl">
              {restaurant.description}
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 gap-2">
          <div className="flex flex-col text-left md:text-right text-[10px] text-gray-400 font-semibold space-y-0.5">
            <span className="flex items-center md:justify-end space-x-1 text-gray-500">
              <MapPin size={10} className="text-orange-500" />
              <span>{restaurant.location}</span>
            </span>
            <span className="flex items-center md:justify-end space-x-1 text-gray-500">
              <Clock size={10} className="text-orange-500" />
              <span>{restaurant.deliveryTime}</span>
            </span>
          </div>
          <button className="bg-gray-50 hover:bg-red-50 hover:text-red-500 border border-gray-200 p-2 rounded-lg text-gray-500 transition-colors">
            <Heart size={14} className="transition-colors duration-200" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items Area */}
        <div className="lg:col-span-2">
          {/* Category Selector Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 mb-4 border-b border-gray-100 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === cat
                    ? "bg-orange-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
                id={`category-tab-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* High-Density Menu Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMenu.map((item) => {
              const qty = getQuantity(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3 hover:border-orange-500 transition-all duration-150 shadow-sm"
                  id={`menu-item-${item.id}`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-gray-50 relative border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-grow justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-orange-600 font-bold text-xs shrink-0">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-[10px] line-clamp-2 font-light leading-normal mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-end items-center mt-2">
                      {qty > 0 ? (
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg py-0.5 px-1 space-x-2">
                          <button
                            onClick={() => onRemoveFromCart(item.id)}
                            className="w-5 h-5 rounded bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600 border border-gray-200 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                            id={`btn-minus-${item.id}`}
                          >
                            <Minus size={10} />
                          </button>
                          <span className="font-bold text-gray-800 text-xs">{qty}</span>
                          <button
                            onClick={() => onAddToCart(item)}
                            className="w-5 h-5 rounded bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600 border border-gray-200 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                            id={`btn-plus-${item.id}`}
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="inline-flex items-center space-x-1 bg-gray-950 hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-lg cursor-pointer transition-all shadow-sm"
                          id={`btn-add-${item.id}`}
                        >
                          <Plus size={10} />
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

        {/* Dense Sticky Basket Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center space-x-1.5">
                <ShoppingBag size={14} className="text-orange-600" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Basket</h3>
              </div>
              <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded">
                {totalCartItems} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-50 text-gray-300 rounded-lg flex items-center justify-center mb-2">
                  <ShoppingBag size={18} />
                </div>
                <p className="text-gray-400 text-xs font-medium">Your basket is empty.</p>
                <p className="text-gray-400 text-[10px] mt-0.5">Select menu items to begin.</p>
              </div>
            ) : (
              <div>
                {/* Cart Items List */}
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 mb-4">
                  {cart.map((item) => (
                    <div key={item.food.id} className="flex justify-between items-center text-xs gap-2 py-1 border-b border-gray-50 last:border-0">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="font-extrabold text-orange-600 text-[10px]">{item.quantity}x</span>
                        <span className="text-gray-800 font-semibold truncate">{item.food.name}</span>
                      </div>
                      <span className="text-gray-600 font-bold shrink-0">
                        ${(item.food.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bill Details */}
                <div className="space-y-1.5 border-t border-gray-100 pt-3 mb-4 text-[11px]">
                  <div className="flex justify-between text-gray-400 font-semibold">
                    <span>Subtotal</span>
                    <span className="text-gray-700">${totalCartPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-semibold">
                    <span>Delivery Fee</span>
                    <span className="text-green-600 font-bold uppercase tracking-wide">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-extrabold text-sm pt-2 border-t border-gray-100">
                    <span>Total Price</span>
                    <span className="text-orange-600">${totalCartPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={onProceedToCheckout}
                  className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-1.5"
                  id="btn-menu-checkout"
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
