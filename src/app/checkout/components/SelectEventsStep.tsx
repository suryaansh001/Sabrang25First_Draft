import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { EventCatalogItem } from '../../../lib/eventCatalog';
import { CheckoutState } from '../types';
import { Check } from 'lucide-react';
import { isFlagshipGroupEvent, isFlagshipSoloEvent } from '../utils';

interface SelectEventsStepProps {
  eventCatalog: EventCatalogItem[];
  selectedEventIds: number[];
  visitorPassDays: number;
  onUpdateState: (updates: Partial<CheckoutState>) => void;
}

export function SelectEventsStep({
  eventCatalog,
  selectedEventIds,
  visitorPassDays,
  onUpdateState,
}: SelectEventsStepProps) {
  const toggleEvent = (id: number) => {
    // Prevent adding event id 10 (In Conversation With) as registration is closed
    if (id === 10) return;
    
    if (selectedEventIds.includes(id)) {
      onUpdateState({ selectedEventIds: selectedEventIds.filter(x => x !== id) });
    } else {
      onUpdateState({ selectedEventIds: [...selectedEventIds, id] });
    }
  };

  const updateVisitorPassDays = (days: number) => {
    onUpdateState({ visitorPassDays: Math.max(0, Math.min(3, days)) });
  };

  // Group events by category
  const eventsByCategory = useMemo(() => {
    const flagship: EventCatalogItem[] = [];
    const nonFlagship: EventCatalogItem[] = [];
    
    eventCatalog.forEach(event => {
      if (event.category === 'Flagship') {
        flagship.push(event);
      } else {
        nonFlagship.push(event);
      }
    });

    const categories = new Map<string, EventCatalogItem[]>();
    categories.set('Flagship', flagship);
    categories.set('Non-flagship', nonFlagship);
    return categories;
  }, [eventCatalog]);

  const selectedEvents = useMemo(
    () => eventCatalog.filter(e => selectedEventIds.includes(e.id)),
    [eventCatalog, selectedEventIds]
  );

  return (
    <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
      <div className="lg:col-span-3">
        {/* Cart Loaded Banner */}
        {selectedEventIds.length > 0 && (
          <div className="bg-green-500/15 border border-green-400/40 rounded-lg p-4 mb-6 shadow-lg">
            <p className="text-sm text-green-200">
              <strong>✓ Cart Loaded:</strong> {selectedEventIds.length} event{selectedEventIds.length !== 1 ? 's' : ''} from your cart {selectedEventIds.length === 1 ? 'has' : 'have'} been automatically selected.
            </p>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-6 title-chroma">Choose Your Events</h2>

        {/* Special Offer Banner */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🎉</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-purple-300">
                SPECIAL OFFER
              </h3>
              <p className="text-sm text-white/80 mt-1">
                Get 25% off on all events - Limited time only!
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            <div className="bg-black/40 border border-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
              <span className="text-purple-300 font-mono text-lg font-bold tracking-wider">
                SPECIALOFFER
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText('SPECIALOFFER');
                alert('Coupon code copied! Apply it at checkout.');
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-semibold cursor-pointer"
            >
              Copy Code
            </button>
          </div>
        </div>

        {/* Events by Category */}
        {Array.from(eventsByCategory.entries()).map(([category, events]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-4">
              <span className="text-yellow-400">
                {category}
              </span>
            </h3>
            <div className="space-y-3">
              {events.map(event => {
                const isSelected = selectedEventIds.includes(event.id);
                const isClosed = event.id === 10; // In Conversation With is closed
                return (
                  <motion.div
                    key={event.id}
                    onClick={() => !isClosed && toggleEvent(event.id)}
                    whileHover={!isClosed ? { scale: 1.01 } : {}}
                    className={`relative p-5 rounded-xl transition-all duration-200 border overflow-hidden backdrop-blur-sm ${
                      isClosed
                        ? 'bg-red-900/20 border-red-400/50 cursor-not-allowed opacity-60'
                        : isSelected
                          ? 'bg-white/10 border-white/20 shadow-lg cursor-pointer'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg truncate text-white">{event.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {isClosed ? (
                            <p className="text-sm font-semibold text-red-300">
                              Registration Closed
                            </p>
                          ) : (
                            <>
                              <p className="text-base font-bold text-cyan-400">
                                {event.price}
                              </p>
                              {event.teamSize && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/20">
                                  👥 {event.teamSize}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      {!isClosed && isSelected && (
                        <div className="relative flex-shrink-0">
                          <span className="absolute -inset-2 rounded-full bg-cyan-500/30 blur-md"></span>
                          <div className="relative w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Visitor Pass Section */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-4">
            <span className="text-yellow-400">Visitor Pass</span>
          </h3>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-200 mb-2">Visitor Pass</h4>
                <p className="text-sm text-white/70 mb-3">
                  Required for non-participant entry to Sabrang venues. Select number of days for your visitor pass.
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
                  <span>Price: ₹69 per day</span>
                  <span>•</span>
                  <span>Non-transferable</span>
                  <span>•</span>
                  <span>Non-refundable</span>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-3">
                <button
                  onClick={() => updateVisitorPassDays(visitorPassDays - 1)}
                  disabled={visitorPassDays === 0}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-lg font-semibold min-w-[2.5rem] text-center">{visitorPassDays}</span>
                <button
                  onClick={() => updateVisitorPassDays(visitorPassDays + 1)}
                  disabled={visitorPassDays >= 3}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            {visitorPassDays > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Visitor Pass ({visitorPassDays} day{visitorPassDays > 1 ? 's' : ''})</span>
                  <span className="text-yellow-400 font-medium">₹{visitorPassDays * 69}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Summary */}
      <div className="lg:sticky lg:top-24 h-fit self-start">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
          <h3 className="font-semibold text-cyan-200 mb-6">Selected Items</h3>
          <ul className="space-y-3 text-sm">
            {visitorPassDays > 0 && (
              <li className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <div className="font-medium text-white">Visitor Pass ({visitorPassDays} day{visitorPassDays > 1 ? 's' : ''})</div>
                  <div className="text-xs text-white/70 mt-1">Non-participant entry</div>
                </div>
                <span className="text-yellow-400 font-semibold">₹{visitorPassDays * 69}</span>
              </li>
            )}
            {selectedEvents.map(ev => (
              <li key={ev.id} className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <div className="font-medium text-white">{ev.title}</div>
                  <div className="text-xs text-white/70 mt-1">{ev.category}</div>
                </div>
                <span className="font-semibold text-cyan-400">{ev.price}</span>
              </li>
            ))}
          </ul>
          {(selectedEventIds.length > 0 || visitorPassDays > 0) && (
            <div className="border-t border-white/20 mt-6 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-lg font-bold text-white">
                  ₹{(selectedEvents.reduce((sum, ev) => sum + parseFloat(ev.price.replace(/[^0-9.]/g, '') || '0'), 0) + visitorPassDays * 69).toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          {/* Continue Button */}
          {(selectedEventIds.length > 0 || visitorPassDays > 0) && (
            <div className="mt-6 pt-4 border-t border-white/20">
              <button
                onClick={() => {
                  const event = new CustomEvent('proceedToForms');
                  window.dispatchEvent(event);
                }}
                className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg font-semibold cursor-pointer"
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
