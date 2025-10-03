'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Zap, Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Maintenance: React.FC = () => {
  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Diamond Shape */}
      <div className="absolute right-0 bottom-0 w-96 h-96 rotate-45 border-2 border-orange-600/20 translate-x-48 translate-y-48"></div>
      
      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-1 bg-orange-600 h-16 flex-shrink-0"></div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">We'll be back soon!</h1>
              <p className="text-gray-400 text-sm md:text-base">
                We're currently performing scheduled maintenance to improve your experience. Thank you for your patience.
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* System Upgrade Card */}
          <div className="flex items-start gap-3">
            <div className="w-1 bg-orange-600 h-full flex-shrink-0"></div>
            <div className="bg-neutral-900 p-4 rounded-lg flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-orange-600/20 p-1.5 rounded">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold">System Upgrade</h3>
              </div>
              <p className="text-gray-400 text-sm">
                We're installing new features and improvements to make your experience better.
              </p>
            </div>
          </div>

          {/* Relax Card */}
          <div className="flex items-start gap-3">
            <div className="w-1 bg-orange-600 h-full flex-shrink-0"></div>
            <div className="bg-neutral-900 p-4 rounded-lg flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-orange-600/20 p-1.5 rounded">
                  <Coffee className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold">Relax</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Take a quick break
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Back Home Button */}
          <button
            onClick={handleBackHome}
            className="bg-orange-600 hover:bg-orange-700 transition-colors p-4 rounded-lg flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-orange-200 mb-0.5">NAVIGATE</div>
                <div className="text-base font-semibold">Back Home</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-colors p-4 rounded-lg flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">ACTION</div>
                <div className="text-base font-semibold">Refresh</div>
              </div>
            </div>
            <RefreshCw className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 pt-4 flex items-center justify-end">
          <div className="text-orange-600 text-sm">
            team sabrang
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
