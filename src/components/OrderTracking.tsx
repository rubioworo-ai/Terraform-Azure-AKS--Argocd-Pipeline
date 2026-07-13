import React, { useEffect, useState } from "react";
import { Check, Clock, Loader2, ShoppingBag, MapPin, RefreshCw } from "lucide-react";
import axios from "axios";
import { Order } from "../types";

interface OrderTrackingProps {
  orderId: number;
  onBackToHome: () => void;
}

export default function OrderTracking({ orderId, onBackToHome }: OrderTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchOrderStatus = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      // Format response keys into our frontend model camelCase
      const mappedOrder: Order = {
        id: response.data.id,
        customerName: response.data.customer_name,
        foodItem: response.data.food_item,
        quantity: response.data.quantity,
        status: response.data.status,
        totalPrice: response.data.totalPrice,
        createdAt: response.data.createdAt
      };
      setOrder(mappedOrder);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error("Error fetching order status:", err);
      setError("Failed to fetch order updates. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  // Poll status every 4 seconds
  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(() => {
      fetchOrderStatus();
    }, 4000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading && !order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 size={24} className="text-orange-600 animate-spin mb-3" />
        <p className="text-gray-600 text-sm font-semibold">Connecting to Kitchen...</p>
        <p className="text-gray-400 text-[10px] mt-0.5">Retrieving order details for #{orderId}</p>
      </div>
    );
  }

  const steps = [
    {
      key: "PENDING",
      title: "Order Placed",
      description: "We have received your order and are confirming details with the kitchen.",
    },
    {
      key: "PREPARING",
      title: "Preparing in Kitchen",
      description: "Our professional chefs are hand-crafting your meal using fresh ingredients.",
    },
    {
      key: "OUT_FOR_DELIVERY",
      title: "Out for Delivery",
      description: "Your food is securely packed. A delivery partner is zooming to your location.",
    },
    {
      key: "DELIVERED",
      title: "Delivered & Enjoy!",
      description: "Ding-dong! Your fresh meal has successfully reached its destination. Bon appétit!",
    }
  ];

  const getStepStatus = (stepKey: string) => {
    if (!order) return "upcoming";
    const statusOrder = ["PENDING", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  const getTimerCountdown = () => {
    if (!order) return "-- min";
    if (order.status === "DELIVERED") return "Delivered";

    // Estimate based on status
    if (order.status === "PENDING") return "25 mins";
    if (order.status === "PREPARING") return "15 mins";
    if (order.status === "OUT_FOR_DELIVERY") return "5 mins";
    return "20 mins";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm">

        {/* Header Block */}
        <div className="text-center pb-5 border-b border-gray-100 mb-6">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3 animate-bounce">
            <ShoppingBag size={18} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            ORDER CONFIRMED!
          </h1>
          <p className="text-gray-500 text-xs mt-1.5">
            Thank you, <span className="font-semibold text-gray-800">{order?.customerName}</span>. Your food is on its way!
          </p>
          <div className="inline-flex items-center space-x-1.5 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg text-[10px] font-bold text-gray-500 mt-3 uppercase tracking-wider">
            <span>ORDER ID: #{order?.id}</span>
            <span className="text-gray-300">|</span>
            <span>STATUS: {order?.status}</span>
          </div>
        </div>

        {/* Delivery ETA & Manual Refresh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3 border border-gray-200 rounded-lg mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white shrink-0">
              <Clock size={14} />
            </div>
            <div>
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Est. Delivery</div>
              <div className="text-sm font-black text-gray-900">{getTimerCountdown()}</div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
            <div className="text-left sm:text-right">
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Auto updates</div>
              <div className="text-[10px] text-gray-500">Last updated: {lastUpdated}</div>
            </div>
            <button
              onClick={fetchOrderStatus}
              className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shadow-sm"
              title="Refresh Status"
              id="btn-refresh-status"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* Stepper Tracking Widget */}
        <div className="space-y-4 relative before:absolute before:left-3.5 sm:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
          {steps.map((step, index) => {
            const status = getStepStatus(step.key);

            return (
              <div key={step.key} className="flex gap-4 relative z-10">
                {/* Visual Circle Indicator */}
                <div className="shrink-0">
                  {status === "completed" ? (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ) : status === "active" ? (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-sm ring-4 ring-orange-100 animate-pulse">
                      <Loader2 size={12} className="animate-spin text-white" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-50 text-gray-400 border border-gray-200 rounded-full flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Step content */}
                <div className="py-0.5">
                  <h3 className={`font-bold text-xs sm:text-sm leading-tight ${
                    status === "completed" ? "text-gray-900" : status === "active" ? "text-orange-600" : "text-gray-400"
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-light mt-0.5 max-w-md leading-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order details summary card */}
        <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Food Summary</h3>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="bg-orange-100 text-orange-600 font-extrabold px-1.5 py-0.5 rounded text-[10px]">
                {order?.quantity}x
              </div>
              <div>
                <div className="font-semibold text-gray-800">{order?.foodItem}</div>
                <div className="text-[10px] text-gray-400 font-light mt-0.5">Contactless delivery selected</div>
              </div>
            </div>
            <div className="font-bold text-gray-900 text-sm">
              ${order?.totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-all cursor-pointer shadow-sm text-center"
            id="btn-back-home"
          >
            Browse More Food
          </button>

          <div className="flex items-center space-x-1 text-[10px] text-gray-400 font-medium">
            <span>Need assistance? Contact support</span>
          </div>
        </div>

      </div>
    </div>
  );
}
