import React, { useState } from "react";
import { ArrowLeft, User, MapPin, CreditCard, ShoppingBag, Loader2, ShieldCheck } from "lucide-react";
import { CartItem } from "../types";

interface CheckoutFormProps {
  cart: CartItem[];
  onBack: () => void;
  onPlaceOrder: (customerName: string, deliveryAddress: string) => Promise<void>;
}

export default function CheckoutForm({ cart, onBack, onPlaceOrder }: CheckoutFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!deliveryAddress.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onPlaceOrder(customerName, deliveryAddress);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-500 hover:text-orange-600 mb-4 transition-colors group cursor-pointer focus:outline-none"
        id="btn-checkout-back"
      >
        <ArrowLeft size={12} className="transform group-hover:-translate-x-0.5 transition-transform duration-200" />
        <span>Return to Menu</span>
      </button>

      <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 tracking-tight">
        SECURE CHECKOUT
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Details</h3>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold rounded-lg">
                {error}
              </div>
            )}

            {/* Customer Name */}
            <div>
              <label htmlFor="customer-name" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                  <User size={12} />
                </span>
                <input
                  type="text"
                  id="customer-name"
                  placeholder="e.g. Jane Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label htmlFor="delivery-address" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Delivery Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                  <MapPin size={12} />
                </span>
                <input
                  type="text"
                  id="delivery-address"
                  placeholder="e.g. 123 Main St, Apartment 4B"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label htmlFor="special-instructions" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Special Instructions (Optional)
              </label>
              <textarea
                id="special-instructions"
                rows={2}
                placeholder="e.g. Leave on the porch, ring the doorbell twice"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors resize-none"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Method</h3>
            <div className="p-3 border border-orange-200 bg-orange-500/5 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                  <CreditCard size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Cash on Delivery (COD)</div>
                  <div className="text-[10px] text-gray-400 font-medium">Pay securely at your doorstep</div>
                </div>
              </div>
              <ShieldCheck className="text-orange-600" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
            id="btn-place-order"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={12} className="animate-spin text-white" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Place Order (${total.toFixed(2)})</span>
            )}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3 sticky top-20">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100 flex items-center space-x-1.5">
              <ShoppingBag size={14} className="text-orange-600" />
              <span>Basket Summary</span>
            </h3>

            {/* Cart Items */}
            <div className="divide-y divide-gray-50 max-h-[180px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.food.id} className="py-2 flex justify-between items-center text-xs gap-2">
                  <div className="truncate pr-2">
                    <div className="font-semibold text-gray-800 truncate">{item.food.name}</div>
                    <div className="text-[10px] text-gray-400 font-light">Qty: {item.quantity} × ${item.food.price.toFixed(2)}</div>
                  </div>
                  <span className="font-bold text-gray-600 shrink-0">
                    ${(item.food.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Breakdown */}
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-gray-400 font-semibold">
                <span>Subtotal</span>
                <span className="text-gray-700">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-semibold">
                <span>GST / Taxes (8%)</span>
                <span className="text-gray-700">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-semibold">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-bold uppercase tracking-wide">FREE</span>
              </div>
              <div className="flex justify-between text-gray-900 font-extrabold text-sm pt-2 border-t border-gray-100">
                <span>Grand Total</span>
                <span className="text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
