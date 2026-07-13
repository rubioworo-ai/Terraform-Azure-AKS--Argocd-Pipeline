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
  
  // Data State
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<Food[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  
  // UI States
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  
  // Notification Toast State
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  // Load Restaurants on mount
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

  // Sync Cart with localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("quickbite_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
  }, []);

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("quickbite_cart", JSON.stringify(newCart));
  };

  // Fetch menu when selected restaurant changes
  const handleSelectRestaurant = async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoadingMenu(true);
    setCurrentView("menu");
    try {
      const response = await axios.get(`/api/restaurants/${restaurant.id}/menu`);
      setMenu(response.data);
    } catch (err) {
      console.error("Error loading menu:", err);
    } finally {
      setLoadingMenu(false);
    }
  };

  // Cart Management
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

  // Create Order and simulation of Notifications
  const handlePlaceOrder = async (customerName: string, deliveryAddress: string) => {
    if (cart.length === 0) {
      throw new Error("Your cart is empty");
    }

    // Format items into aggregated summary
    const foodItemsSummary = cart
      .map((item) => `${item.quantity}x ${item.food.name}`)
      .join(", ");

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const finalTotal = subtotal + tax;

    try {
      // 1. POST to Order Service
      const orderResponse = await axios.post("/api/orders", {
        customer_name: customerName,
        food_item: foodItemsSummary,
        quantity: totalQty,
        totalPrice: finalTotal
      });

      const orderData = orderResponse.data;
      const orderId = orderData.id;

      // 2. Clear Cart
      saveCartToStorage([]);

      // 3. POST to Notification Service
      const notificationResponse = await axios.post("/api/notifications", {
        orderId: orderId,
        message: "Your order has been received"
      });

      // Show slide-down notification with exact returned text
      setActiveNotification({
        id: Date.now(),
        message: notificationResponse.data || "Your order has been received",
        type: "success",
        timestamp: new Date().toISOString()
      });

      // 4. Send to Confirmation Tracking View
      setPlacedOrderId(orderId);
      setCurrentView("confirmation");

    } catch (err: any) {
      console.error("Checkout process failed:", err);
      throw new Error(err.response?.data?.error || "Connection error during checkout.");
    }
  };

  // Filtering Logic
  const filteredRestaurants = restaurants.filter((rest) => {
    const matchesSearch = rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === "All" || rest.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const cuisines = ["All", "Italian", "American", "Asian", "Mexican", "Desserts"];

  // Popular Meals extracted from mock database
  const popularMeals = [
    {
      id: 102,
      restaurantId: 1,
      restaurantName: "Pizza House",
      name: "Pepperoni Blast Pizza",
      price: 16.99,
      description: "Double premium pepperoni, mozzarella cheese, and a sweet hot honey drizzle.",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: 201,
      restaurantId: 2,
      restaurantName: "Burger Place",
      name: "Classic Cheeseburger",
      price: 12.99,
      description: "Flame-grilled premium beef patty, melted cheddar, lettuce, heirloom tomato, and house sauce.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: 302,
      restaurantId: 3,
      restaurantName: "Asian Kitchen",
      name: "Pad Thai Rice Noodles",
      price: 13.99,
      description: "Wok-fired flat rice noodles with organic tofu, crushed peanuts, crunchy bean sprouts, and sweet tamarind sauce.",
      image: "https://images.unsplash.com/photo-1626804475315-9644b37a2f4b?w=500&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 font-sans antialiased pb-8 flex flex-col">
      {/* Top Banner Slide Notifications */}
      <NotificationToast
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
      />

      {/* Header Navbar */}
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

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* VIEW: HOME PAGE */}
        {currentView === "home" && (
          <div className="animate-fade-in space-y-8">
            {/* Hero Section */}
            <Hero onBrowseClick={() => setCurrentView("restaurants")} />

            {/* Featured Restaurants Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight uppercase">
                    Featured Restaurants
                  </h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-widest mt-0.5">Explore curated culinary delights in your vicinity</p>
                </div>
                <button
                  onClick={() => setCurrentView("restaurants")}
                  className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-wider font-extrabold text-orange-600 hover:text-orange-700 cursor-pointer"
                  id="btn-see-all-restaurants"
                >
                  <span>See All</span>
                  <ChevronRight size={12} />
                </button>
              </div>

              {loadingRestaurants ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white border border-gray-100 rounded-xl p-3 space-y-3 animate-pulse">
                      <div className="w-full h-32 bg-gray-100 rounded-lg" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Popular Meals Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-4">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight uppercase">
                  Popular Meals
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-widest mt-0.5">Most loved orders from across the neighborhood</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {popularMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3 shadow-sm hover:border-orange-500 transition-all duration-200 relative group"
                    id={`popular-meal-${meal.id}`}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-grow py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 truncate max-w-[150px]">
                            {meal.name}
                          </h4>
                          <span className="text-orange-600 font-bold text-xs shrink-0">
                            ${meal.price.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                          {meal.restaurantName}
                        </span>
                        <p className="text-gray-500 text-[10px] line-clamp-2 mt-1 leading-normal font-light">
                          {meal.description}
                        </p>
                      </div>

                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => {
                            // Translate to standard food object format
                            const foodObj: Food = {
                              id: meal.id,
                              restaurantId: meal.restaurantId,
                              name: meal.name,
                              price: meal.price,
                              description: meal.description,
                              image: meal.image,
                              category: "Mains"
                            };
                            handleAddToCart(foodObj);
                            
                            // Visual toast feedback on quick add
                            setActiveNotification({
                              id: Date.now(),
                              message: `Added ${meal.name} to cart`,
                              type: "info",
                              timestamp: new Date().toISOString()
                            });
                          }}
                          className="inline-flex items-center space-x-1 bg-gray-950 hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-lg cursor-pointer transition-colors"
                          id={`btn-popular-add-${meal.id}`}
                        >
                          <span>Quick Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: RESTAURANT LISTING */}
        {currentView === "restaurants" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">
                  Browse Restaurants
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-widest mt-0.5">Discover incredible culinary spots ready to deliver</p>
              </div>

              {/* Filters Block */}
              <div className="flex flex-wrap items-center gap-1.5">
                {cuisines.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCuisine(c)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      selectedCuisine === c
                        ? "bg-orange-600 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    id={`cuisine-filter-${c}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <Compass size={14} />
              </span>
              <input
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors shadow-sm"
              />
            </div>

            {/* Restaurant Grid */}
            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                <Compass size={28} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">No restaurants found</p>
                <p className="text-gray-400 text-[10px] mt-0.5">Try adjusting your keyword or cuisine filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((rest) => (
                  <RestaurantCard
                    key={rest.id}
                    restaurant={rest}
                    onClick={() => { handleSelectRestaurant(rest); }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: RESTAURANT MENU */}
        {currentView === "menu" && selectedRestaurant && (
          <div className="animate-fade-in">
            {loadingMenu ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 size={24} className="text-orange-600 animate-spin mb-3" />
                <p className="text-gray-600 text-sm font-semibold">Whipping up the menu...</p>
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

        {/* VIEW: SECURE CHECKOUT */}
        {currentView === "checkout" && (
          <div className="animate-fade-in">
            {cart.length === 0 ? (
              <div className="max-w-md mx-auto text-center py-16 px-4 bg-white rounded-xl border border-gray-200 my-8 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag size={18} />
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Cart is Empty</h3>
                <p className="text-gray-500 text-[11px] mt-1.5 leading-relaxed font-light">
                  Looks like you haven't added any delicious food items to your order yet.
                </p>
                <button
                  onClick={() => setCurrentView("restaurants")}
                  className="mt-4 inline-flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] uppercase tracking-wider py-2 px-4 rounded-lg cursor-pointer transition-all"
                  id="btn-empty-cart-browse"
                >
                  <span>Browse Food Items</span>
                </button>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* VIEW: ORDER PROGRESS TRACKER */}
        {currentView === "confirmation" && placedOrderId !== null && (
          <div className="animate-fade-in">
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

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-200 mt-12 py-8 px-4 border-t border-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-orange-600 flex items-center justify-center text-white text-[11px] font-black">
                <Utensils size={12} />
              </div>
              <span className="font-black text-sm text-white">QUICKBITE</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
              Bringing mouthwatering dishes right from restaurant kitchens straight to your table with speed.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-orange-500 mb-2.5">Popular Cuisines</h4>
            <ul className="space-y-1 text-[11px] text-gray-400 font-medium">
              <li><button onClick={() => { setSelectedCuisine("Italian"); setCurrentView("restaurants"); }} className="hover:text-white transition-colors cursor-pointer text-left">Italian Wood-fired</button></li>
              <li><button onClick={() => { setSelectedCuisine("American"); setCurrentView("restaurants"); }} className="hover:text-white transition-colors cursor-pointer text-left">Gourmet Burgers</button></li>
              <li><button onClick={() => { setSelectedCuisine("Asian"); setCurrentView("restaurants"); }} className="hover:text-white transition-colors cursor-pointer text-left">Traditional Pan-Asian</button></li>
              <li><button onClick={() => { setSelectedCuisine("Mexican"); setCurrentView("restaurants"); }} className="hover:text-white transition-colors cursor-pointer text-left">Mexican Street Tacos</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-orange-500 mb-2.5">Get Help</h4>
            <ul className="space-y-1 text-[11px] text-gray-400 font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">Support Center</li>
              <li className="hover:text-white transition-colors cursor-pointer">Refund Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-gray-900 text-center text-[10px] text-gray-500 font-semibold tracking-wide uppercase">
          &copy; {new Date().getFullYear()} QuickBite Food Delivery Application. Sandbox preview mode.
        </div>
      </footer>
    </div>
  );
}

// Add CSS keyframes block to render nice fading and sliding animations
const styleElement = document.createElement("style");
styleElement.innerHTML = `
@keyframes slide-in {
  0% { transform: translate(-50%, -100%); opacity: 0; }
  100% { transform: translate(-50%, 0); opacity: 1; }
}
@keyframes shrink-width {
  0% { width: 100%; }
  100% { width: 0%; }
}
@keyframes swing {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
}
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-slide-in {
  animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-shrink-width {
  animation: shrink-width 5s linear forwards;
}
.animate-swing {
  animation: swing 1s ease-in-out infinite alternate;
}
.animate-fade-in {
  animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;
document.head.appendChild(styleElement);
