import React, { useEffect, useState } from "react";
import { Check, Clock, Loader2, RefreshCw, ShoppingBag } from "lucide-react";
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
      setError("Failed to fetch order updates.");
    } finally {
      setLoading(false);
    }
  };

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
        <Loader2 size={36} className="text-orange-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Connecting to Kitchen...</p>
      </div>
    );
  }

  const steps = [
    {
      key: "PENDING",
      title: "Order Placed",
      description: "We have received your order and are confirming details with the kitchen."
    },
    {
      key: "PREPARING",
      title: "Preparing in Kitchen",
      description: "Our professional chefs are hand-crafting your meal using fresh ingredients."
    },
    {
      key: "OUT_FOR_DELIVERY",
      title: "Out for Delivery",
      description: "Your food is securely packed. A delivery partner is zooming to your location."
    },
    {
      key: "DELIVERED",
      title: "Delivered & Enjoy!",
      description: "Ding-dong! Your fresh meal has successfully reached its destination. Bon appétit!"
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
    if (order.status === "PENDING") return "25 mins";
    if (order.status === "PREPARING") return "15 mins";
    if (order.status === "OUT_FOR_DELIVERY") return "5 mins";
    return "20 mins";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="text-center pb-6 border-b border-slate-100 mb-8">
          <div className="w-14 h-14 bg-orange-500/10 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Thank you for ordering, <span className="font-semibold text-slate-800">{order?.customerName}</span>. Your food is on its way!
          </p>
          <div className="inline-flex items-center space-x-1 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-full text-[11px] font-mono text-slate-500 mt-4">
            <span>ORDER ID: #{order?.id}</span>
            <span className="text-slate-300">|</span>
            <span>Status: {order?.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Estimated Delivery Time</div>
              <div className="text-base font-bold text-slate-900">{getTimerCountdown()}</div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Status updates automatically</div>
              <div className="text-xs text-slate-500">Last updated: {lastUpdated}</div>
            </div>
            <button
              onClick={fetchOrderStatus}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-6 relative before:absolute before:left-5 sm:before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
          {steps.map((step, index) => {
            const status = getStepStatus(step.key);

            return (
              <div key={step.key} className="flex gap-4 sm:gap-6 relative z-10">
                <div className="shrink-0">
                  {status === "completed" ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md">
                      <Check size={18} strokeWidth={3} />
                    </div>
                  ) : status === "active" ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-orange-100 animate-pulse">
                      <Loader2 size={18} className="animate-spin text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 text-slate-300 border border-slate-200 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  )}
                </div>

                <div className="py-1">
                  <h3 className={`font-bold text-sm sm:text-base leading-tight ${
                    status === "completed" ? "text-slate-800" : status === "active" ? "text-orange-600" : "text-slate-400"
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-light mt-1 max-w-lg leading-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Your Food Summary</h3>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                {order?.quantity}x
              </div>
              <div>
                <div className="font-semibold text-slate-800">{order?.foodItem}</div>
              </div>
            </div>
            <div className="font-extrabold text-slate-900 text-base">
              ${order?.totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto bg-slate-900 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm px-8 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm text-center"
          >
            Order Something Else
          </button>
        </div>
      </div>
    </div>
  );
}
