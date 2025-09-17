'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Download, Mail, Calendar, MapPin, Home } from 'lucide-react';
import Galaxy from '../../../../components/galaxybg';
import createApiUrl from '../../../lib/api';

interface PaymentStatusData {
  orderId: string;
  paymentStatus: 'completed' | 'pending' | 'failed';
  totalAmount: number;
  items: Array<{ itemName: string; price: number }>;
  transactionId?: string;
  userRegistered: boolean;
  qrGenerated: boolean;
  emailSent: boolean;
  user?: {
    name: string;
    email: string;
    events: string[];
    qrPath?: string;
  };
  paymentCompletedAt?: string;
  emailSentAt?: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (!orderId) {
      setError('No order ID found in URL');
      setLoading(false);
      return;
    }

    // Check payment status
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(createApiUrl(`/api/payments/status/${orderId}`), {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to check payment status');
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to get payment status');
        }

        setPaymentData(data.data);
      } catch (err) {
        console.error('Payment status check error:', err);
        setError(err instanceof Error ? err.message : 'Failed to check payment status');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-16 h-16 text-green-400" />;
      case 'pending': return <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />;
      case 'failed': return <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center text-red-400 font-bold text-2xl">✕</div>;
      default: return null;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'completed': return 'Payment Successful!';
      case 'pending': return 'Payment Processing...';
      case 'failed': return 'Payment Failed';
      default: return 'Unknown Status';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-neutral-950 to-black">
          <Galaxy transparent={true} mouseInteraction={false} density={1} glowIntensity={0.35} saturation={0.15} rotationSpeed={0.05} twinkleIntensity={0.4} autoCenterRepulsion={0.1} />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-neutral-950 to-black">
          <Galaxy transparent={true} mouseInteraction={false} density={1} glowIntensity={0.35} saturation={0.15} rotationSpeed={0.05} twinkleIntensity={0.4} autoCenterRepulsion={0.1} />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center text-red-400 font-bold text-2xl mx-auto mb-4">✕</div>
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => router.push('/checkout')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium hover:scale-105 transition-transform"
          >
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-neutral-950 to-black">
          <Galaxy transparent={true} mouseInteraction={false} density={1} glowIntensity={0.35} saturation={0.15} rotationSpeed={0.05} twinkleIntensity={0.4} autoCenterRepulsion={0.1} />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="text-center">
          <p className="text-white/70">No payment data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-neutral-950 to-black">
        <Galaxy transparent={true} mouseInteraction={false} density={1} glowIntensity={0.35} saturation={0.15} rotationSpeed={0.05} twinkleIntensity={0.4} autoCenterRepulsion={0.1} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.08),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.06),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center mb-6">
            {getStatusIcon(paymentData.paymentStatus)}
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${getStatusColor(paymentData.paymentStatus)}`}>
            {getStatusMessage(paymentData.paymentStatus)}
          </h1>
          <p className="text-white/70 text-lg">
            Order ID: {paymentData.orderId}
          </p>
          {paymentData.transactionId && (
            <p className="text-white/60 text-sm mt-1">
              Transaction ID: {paymentData.transactionId}
            </p>
          )}
        </motion.div>

        {paymentData.paymentStatus === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Order Details */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-cyan-200">Order Details</h2>
              <div className="space-y-3">
                {paymentData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white/80">{item.itemName}</span>
                    <span className="text-white/90 font-medium">₹{item.price}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 flex justify-between items-center font-bold">
                  <span>Total Paid</span>
                  <span className="text-green-400">₹{paymentData.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Registration Status */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-cyan-200">Registration Status</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${paymentData.userRegistered ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-white/80">Account Registration</span>
                  <span className={`text-sm ${paymentData.userRegistered ? 'text-green-400' : 'text-yellow-400'}`}>
                    {paymentData.userRegistered ? 'Complete' : 'In Progress'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${paymentData.qrGenerated ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-white/80">QR Code Generation</span>
                  <span className={`text-sm ${paymentData.qrGenerated ? 'text-green-400' : 'text-yellow-400'}`}>
                    {paymentData.qrGenerated ? 'Complete' : 'In Progress'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${paymentData.emailSent ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-white/80">Email Confirmation</span>
                  <span className={`text-sm ${paymentData.emailSent ? 'text-green-400' : 'text-yellow-400'}`}>
                    {paymentData.emailSent ? 'Sent' : 'Sending'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {paymentData.paymentStatus === 'completed' && paymentData.user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-cyan-200">What's Next?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-white/90">Check Your Email</h3>
                      <p className="text-sm text-white/70">
                        We've sent your tickets and QR codes to {paymentData.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-white/90">Mark Your Calendar</h3>
                      <p className="text-sm text-white/70">
                        Save the dates for your registered events
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-white/90">Event Venue</h3>
                      <p className="text-sm text-white/70">
                        JK Lakshmipat University, Jaipur
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-cyan-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-white/90">Download QR Code</h3>
                      <p className="text-sm text-white/70">
                        Keep your QR code ready for event entry
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {paymentData.paymentStatus === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <div className="glass rounded-2xl p-6 border border-yellow-400/30 bg-yellow-500/10">
              <h2 className="text-xl font-semibold mb-4 text-yellow-300">Payment Processing</h2>
              <p className="text-yellow-200 mb-4">
                Your payment is being processed. This usually takes a few minutes. 
                You will receive a confirmation email once the payment is complete.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/50 rounded-lg hover:bg-yellow-500/30 transition-colors"
              >
                Refresh Status
              </button>
            </div>
          </motion.div>
        )}

        {paymentData.paymentStatus === 'failed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <div className="glass rounded-2xl p-6 border border-red-400/30 bg-red-500/10">
              <h2 className="text-xl font-semibold mb-4 text-red-300">Payment Failed</h2>
              <p className="text-red-200 mb-4">
                Your payment could not be processed. Please try again or contact support if the issue persists.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/checkout')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:scale-105 transition-transform"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full font-medium hover:scale-105 transition-transform"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-white/70">Loading payment status...</p>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}