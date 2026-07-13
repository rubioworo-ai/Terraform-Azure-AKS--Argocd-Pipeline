import React, { useState } from "react";
import { ArrowLeft, User, MapPin, Clipboard, CreditCard, ShoppingBag, Loader2, ShieldCheck } from "lucide-react";
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
  const tax = subtotal * 0.08;
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-slate-600 hover:text-orange-600 font-medium text-sm mb-6 transition-colors group cursor-pointer focus:outline-none"
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Return to Menu</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">
        Secure Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base mb-2">Delivery Details</h3>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="customer-name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Your Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  id="customer-name"
                  placeholder="e.g. Jane Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="delivery-address" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Delivery Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <MapPin size={16} />
                </span>
                <input
                  type="text"
                  id="delivery-address"
                  placeholder="e.g. 123 Main St, Apartment 4B"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="special-instructions" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                id="special-instructions"
                rows={3}
                placeholder="e.g. Leave on the porch, ring the doorbell twice"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors resize-none"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">Payment Method</h3>
            <div className="p-4 border border-orange-200 bg-orange-500/5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <CreditCard size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Cash on Delivery (COD)</div>
                  <div className="text-xs text-slate-500 font-light">Pay cash at your doorstep safely</div>
                </div>
              </div>
              <ShieldCheck className="text-orange-600" size={20} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-orange-600 active:scale-98 text-white py-4 px-4 rounded-2xl font-semibold text-base transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin text-white" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Place Order (${total.toFixed(2)})</span>
            )}
          </button>
        </form>

        <div className="md:col-span-2">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 sticky top-24">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-50 flex items-center space-x-2">
              <ShoppingBag size={16} className="text-orange-600" />
              <span>Basket Summary</span>
            </h3>

            <div className="divide-y divide-slate-50 max-h-[250px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.food.id} className="py-3 flex justify-between items-center text-sm gap-2">
                  <div className="truncate pr-2">
                    <div className="font-semibold text-slate-800 truncate">{item.food.name}</div>
                    <div className="text-xs text-slate-400 font-light">Qty: {item.quantity} × ${item.food.price.toFixed(2)}</div>
                  </div>
                  <span className="font-medium text-slate-600 shrink-0">
                    ${(item.food.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST / Taxes (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-base pt-3 border-t border-slate-100">
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
