import React, { useState, useEffect } from "react";
import axios from "axios";
import { Utensils, Star, Clock, ShoppingBag, ArrowRight, Heart, Sparkles, ChevronRight, Compass, Loader2 } from "lucide-react";

import { Restaurant, Food, CartItem, Order, Notification } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RestaurantCard from "./components/RestaurantCard";
import MenuSection from "./components/MenuSection";
import CheckoutForm from "./components/CheckoutForm";
import OrderTracking from "./components/OrderTracking";
import NotificationToast from "./components/NotificationToast";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "restaurants" | "menu" | "checkout" | "confirmation">("home");
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<Food[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoadingRestaurants(true);
        const response = await axios.get("/api/restaurants");
        setRestaurants(response.data);
      } catch (err) {
        console.error("Error loading restaurants:", err);
      } finally {
        setLoadingRestaurants(false);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("quickbite_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("quickbite_cart", JSON.stringify(newCart));
  };

  const handleSelectRestaurant = async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoadingMenu(true);
    setCurrentView("menu");
    try {
      const response = await axios.get(`/api/restaurants/${restaurant.id}/menu`);
      setMenu(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMenu(false);
    }
  };

  const handleAddToCart = (food: Food) => {
    const existingIndex = cart.findIndex((item) => item.food.id === food.id);
    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ food, quantity: 1 });
    }
    saveCartToStorage(newCart);
  };

  const handleRemoveFromCart = (foodId: number) => {
    const existingIndex = cart.findIndex((item) => item.food.id === foodId);
    if (existingIndex === -1) return;

    let newCart = [...cart];
    if (newCart[existingIndex].quantity > 1) {
      newCart[existingIndex].quantity -= 1;
    } else {
      newCart.splice(existingIndex, 1);
    }
    saveCartToStorage(newCart);
  };

  const handlePlaceOrder = async (customerName: string, deliveryAddress: string) => {
    if (cart.length === 0) return;

    const foodItemsSummary = cart
      .map((item) => `${item.quantity}x ${item.food.name}`)
      .join(", ");

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const finalTotal = subtotal + tax;

    try {
      const orderResponse = await axios.post("/api/orders", {
        customer_name: customerName,
        food_item: foodItemsSummary,
        quantity: totalQty,
        totalPrice: finalTotal
      });

      const orderData = orderResponse.data;
      const orderId = orderData.id;

      saveCartToStorage([]);

      const notificationResponse = await axios.post("/api/notifications", {
        orderId: orderId,
        message: "Your order has been received"
      });

      setActiveNotification({
        id: Date.now(),
        message: notificationResponse.data || "Your order has been received",
        type: "success",
        timestamp: new Date().toISOString()
      });

      setPlacedOrderId(orderId);
      setCurrentView("confirmation");

    } catch (err: any) {
      console.error(err);
      throw new Error("Connection error during checkout.");
    }
  };

  const filteredRestaurants = restaurants.filter((rest) => {
    const matchesSearch = rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === "All" || rest.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const cuisines = ["All", "Italian", "American", "Asian"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-12 flex flex-col">
      <NotificationToast
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
      />

      <Navbar
        cart={cart}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === "checkout") {
            setCurrentView("checkout");
          } else if (view === "restaurants") {
            setCurrentView("restaurants");
          } else {
            setCurrentView("home");
          }
        }}
      />

      <main className="flex-grow">
        {currentView === "home" && (
          <div className="space-y-12">
            <Hero onBrowseClick={() => setCurrentView("restaurants")} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Featured Restaurants
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">Explore curated culinary delights in your vicinity</p>
                </div>
                <button
                  onClick={() => setCurrentView("restaurants")}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  <span>See All</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {loadingRestaurants ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white border border-slate-100 rounded-3xl p-4 space-y-4 animate-pulse">
                      <div className="w-full h-48 bg-slate-100 rounded-2xl" />
                      <div className="h-6 bg-slate-100 rounded-lg w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {restaurants.map((rest) => (
                    <RestaurantCard
                      key={rest.id}
                      restaurant={rest}
                      onClick={() => { handleSelectRestaurant(rest); }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === "restaurants" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Browse Restaurants
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">Discover incredible culinary spots ready to deliver</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {cuisines.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCuisine(c)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      selectedCuisine === c
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((rest) => (
                <RestaurantCard
                  key={rest.id}
                  restaurant={rest}
                  onClick={() => { handleSelectRestaurant(rest); }}
                />
              ))}
            </div>
          </div>
        )}

        {currentView === "menu" && selectedRestaurant && (
          <div>
            {loadingMenu ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 size={36} className="text-orange-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Whipping up the menu...</p>
              </div>
            ) : (
              <MenuSection
                restaurant={selectedRestaurant}
                menu={menu}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onBack={() => {
                  setSelectedRestaurant(null);
                  setMenu([]);
                  setCurrentView("restaurants");
                }}
                onProceedToCheckout={() => setCurrentView("checkout")}
              />
            )}
          </div>
        )}

        {currentView === "checkout" && (
          <div>
            <CheckoutForm
              cart={cart}
              onBack={() => {
                if (selectedRestaurant) {
                  setCurrentView("menu");
                } else {
                  setCurrentView("restaurants");
                }
              }}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        )}

        {currentView === "confirmation" && placedOrderId !== null && (
          <div>
            <OrderTracking
              orderId={placedOrderId}
              onBackToHome={() => {
                setPlacedOrderId(null);
                setSelectedRestaurant(null);
                setMenu([]);
                setCurrentView("home");
              }}
            />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-white mt-16 pt-12 pb-8 px-4 border-t border-slate-800 text-center text-xs text-slate-500 font-light">
        &copy; {new Date().getFullYear()} QuickBite Food Delivery Application.
      </footer>
    </div>
  );
}
