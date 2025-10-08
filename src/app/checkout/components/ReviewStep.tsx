import React, { useState } from 'react';
import { EventCatalogItem } from '../../../lib/eventCatalog';
import { CheckoutState } from '../types';
import { parsePrice } from '../utils';
import { ArrowRight, Tag, Loader } from 'lucide-react';
import createApiUrl from '../../../lib/api';

interface ReviewStepProps {
  selectedEvents: EventCatalogItem[];
  state: CheckoutState;
  totalPrice: number;
  finalPrice: number;
  updateState: (updates: Partial<CheckoutState>) => void;
}

export function ReviewStep({
  selectedEvents,
  state,
  totalPrice,
  finalPrice,
  updateState,
}: ReviewStepProps) {
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApplyPromo = async () => {
    const code = state.promoInput.trim();
    if (!code) return;

    // Check if promo is already applied
    if (state.appliedPromo && state.appliedPromo.code === code) {
      setPromoError('This promo code is already applied');
      return;
    }

    setPromoLoading(true);
    setPromoError(null);

    try {
      // Get user email from form data
      let userEmail = '';
      for (const [signature, data] of Object.entries(state.formDataBySignature)) {
        if (data.collegeMailId) {
          userEmail = data.collegeMailId;
          break;
        }
      }
      if (!userEmail && state.visitorPassDetails.collegeMailId) {
        userEmail = state.visitorPassDetails.collegeMailId;
      }

      const response = await fetch(createApiUrl('/admin/promo-codes/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code,
          userEmail: userEmail || 'temp@example.com',
          orderAmount: totalPrice,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setPromoError(data.message || 'Invalid promo code');
        updateState({ appliedPromo: null });
      } else {
        updateState({ appliedPromo: { code, discountAmount: data.discountAmount } });
        setPromoError(null);
      }
    } catch (e) {
      setPromoError('Failed to validate promo code');
      updateState({ appliedPromo: null });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    updateState({ appliedPromo: null, promoInput: '' });
    setPromoError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          <span className="text-cyan-400">Review Your Order</span>
        </h2>
        <p className="text-gray-400 mb-6">Please review your selections before proceeding to payment</p>
      </div>

      {/* Selected Events */}
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-cyan-200">Selected Events</h3>
        <div className="space-y-3">
          {selectedEvents.map(event => (
            <div key={event.id} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
              <div>
                <p className="font-medium text-white">{event.title}</p>
                <p className="text-sm text-white/60">{event.category}</p>
              </div>
              <p className="font-semibold text-cyan-300">{event.price}</p>
            </div>
          ))}

          {state.visitorPassDays > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
              <div>
                <p className="font-medium text-white">Visitor Pass</p>
                <p className="text-sm text-white/60">{state.visitorPassDays} day(s)</p>
              </div>
              <p className="font-semibold text-yellow-400">₹{state.visitorPassDays * 69}</p>
            </div>
          )}
        </div>
      </div>

      {/* Promo Code */}
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-purple-200">Promo Code</h3>
        
        {!state.appliedPromo ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={state.promoInput}
              onChange={(e) => updateState({ promoInput: e.target.value.toUpperCase() })}
              placeholder="Enter promo code"
              className="flex-1 px-4 py-2.5 glass border border-white/20 rounded-lg focus:outline-none focus:border-white/30 text-white placeholder:text-white/40 transition-colors"
            />
            <button
              onClick={handleApplyPromo}
              disabled={promoLoading || !state.promoInput.trim()}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-all flex items-center gap-2 shadow-lg"
            >
              {promoLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4" />
                  Apply
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 glass border border-green-400/40 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-semibold text-green-400">{state.appliedPromo.code}</p>
                <p className="text-sm text-white/70">Discount: ₹{state.appliedPromo.discountAmount}</p>
              </div>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-sm text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded hover:bg-red-500/10"
            >
              Remove
            </button>
          </div>
        )}
        
        {promoError && (
          <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
            <span>⚠️</span> {promoError}
          </p>
        )}
      </div>

      {/* Price Summary */}
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-purple-200">Price Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-white/70">
            <span>Subtotal</span>
            <span className="text-white font-medium">₹{totalPrice.toFixed(2)}</span>
          </div>
          
          {state.appliedPromo && (
            <div className="flex justify-between text-green-400">
              <span>Discount ({state.appliedPromo.code})</span>
              <span className="font-medium">-₹{state.appliedPromo.discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="border-t border-white/20 pt-3 mt-3">
            <div className="flex justify-between text-2xl font-bold">
              <span className="text-white">Total</span>
              <span className="text-purple-400">
                ₹{finalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Proceed to Payment */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            // This will be handled by parent component navigation
            const event = new CustomEvent('proceedToPayment');
            window.dispatchEvent(event);
          }}
          className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all font-semibold flex items-center gap-2 shadow-lg text-lg"
        >
          Proceed to Payment
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
