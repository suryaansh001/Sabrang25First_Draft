'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function RefundPolicyPage() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-100"
        style={{ backgroundImage: "url('/images/about-section/about_back.webp')" }}
      />
      {/* Black filter */}
      <div className="absolute inset-0 bg-black/80" />
      {/* Content */}
      <div className="relative z-10 px-6 md:px-10 lg:px-16 py-16 max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          aria-label="Close"
          className="absolute top-8 right-8 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </button>
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>

        <h2 className="text-2xl font-semibold mb-3">Refund Policy</h2>
        <p className="mb-6 leading-relaxed text-gray-300">All sales are final. We do not offer refunds for any purchases made for event registrations. Please review your selection carefully before completing the payment.</p>

        <h2 className="text-2xl font-semibold mb-3">Cancellation Policy</h2>
        <p className="mb-6 leading-relaxed text-gray-300">Once a registration is confirmed and payment is made, it cannot be cancelled. No cancellations will be entertained under any circumstances.</p>

        <h2 className="text-2xl font-semibold mb-3">Service Provider Clause</h2>
        <p className="mb-6 leading-relaxed text-gray-300">As we provide services for the event, no refunds or cancellations will be processed once a payment has been successfully completed.</p>

        <h2 className="text-2xl font-semibold mb-3">Shipping & Delivery Policy</h2>
        <p className="mb-6 leading-relaxed text-gray-300">This is a digital registration for an on-campus event. No physical products will be shipped. All services and event access will be provided at JK Lakshmipat University as per the event schedule.</p>

        <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
        <div className="space-y-2 text-gray-300">
          <p>JK Lakshmipat University</p>
          <p>Address: JK Lakshmipat University, Mahapura Rd, near Mahindra SEZ, Mahapura, Rajasthan 302026</p>
          <p>Phone: +91 141 7107500</p>
          <p>Email: info@jklu.edu.in</p>
        </div>
      </div>
    </div>
  );
}
