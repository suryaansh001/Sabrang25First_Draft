'use client';

import React, { Suspense } from 'react';
import { CheckoutContent } from './CheckoutContent';
import { Loader } from 'lucide-react';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
        <p className="text-gray-300">Loading checkout...</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
