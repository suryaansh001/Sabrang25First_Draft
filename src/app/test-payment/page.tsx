'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, User, Mail, Phone, IndianRupee, TestTube } from 'lucide-react';

// Declare global for Cashfree
declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function TestPaymentPage() {
  const [formData, setFormData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    amount: 100
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false);

  // Load Cashfree SDK
  useEffect(() => {
    const loadCashfreeSDK = async () => {
      try {
        const { load } = await import('@cashfreepayments/cashfree-js');
        const cashfree = await load({
          mode: 'production'
        });
        window.Cashfree = cashfree;
        setCashfreeLoaded(true);
        console.log('✅ Cashfree SDK loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load Cashfree SDK:', error);
      }
    };

    loadCashfreeSDK();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const testCreateOrder = async () => {
    setIsLoading(true);
    setResult(null);
    setPaymentSessionId(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test-payment/test-create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderAmount: formData.amount,
          customerDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          }
        }),
      });

      const data = await response.json();
      
      if (data.success && data.data.paymentSessionId) {
        setPaymentSessionId(data.data.paymentSessionId);
        setResult({
          type: 'create-order',
          success: true,
          data: {
            orderId: data.data.orderId,
            paymentSessionId: data.data.paymentSessionId,
            orderAmount: data.data.orderAmount,
            message: 'Order created successfully! You can now proceed to payment.'
          },
          status: response.status
        });
      } else {
        setResult({
          type: 'create-order',
          success: false,
          data: data.error || 'Failed to create order',
          status: response.status,
          details: data.details || null
        });
      }

    } catch (error: any) {
      setResult({
        type: 'create-order',
        success: false,
        data: error.message,
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToPayment = async () => {
    if (!paymentSessionId) {
      alert('Please create an order first!');
      return;
    }

    if (!cashfreeLoaded || !window.Cashfree) {
      alert('Cashfree SDK not loaded yet. Please wait and try again.');
      return;
    }

    try {
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: '_self',
      };

      console.log('🚀 Starting Cashfree checkout with session:', paymentSessionId);
      await window.Cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error('❌ Payment checkout failed:', error);
      alert('Failed to open payment page. Please try again.');
    }
  };

  const testPromoValidation = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test-payment/test-validate-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promoCode: 'EARLYBIRD',
          orderAmount: formData.amount
        }),
      });

      const data = await response.json();
      setResult({
        type: 'promo-validation',
        success: data.success,
        data: data.data || data.error,
        status: response.status
      });

    } catch (error: any) {
      setResult({
        type: 'promo-validation',
        success: false,
        data: error.message,
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testCashfreeConfig = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test-payment/test-config`);
      const data = await response.json();
      setResult({
        type: 'cashfree-config',
        success: data.success,
        data: data,
        status: response.status
      });

    } catch (error: any) {
      setResult({
        type: 'cashfree-config',
        success: false,
        data: error.message,
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test-payment/test-config`);
      const data = await response.json();
      setResult({
        type: 'backend-connection',
        success: data.success,
        data: `Backend is reachable! ${data.message || ''}`,
        status: response.status
      });

    } catch (error: any) {
      setResult({
        type: 'backend-connection',
        success: false,
        data: `Backend connection failed: ${error.message}`,
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TestTube className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold">Cashfree Payment Test</h1>
          </div>
          <p className="text-white/70">
            Test the Cashfree payment integration before going live
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-400" />
              Test Payment Data
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Customer Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter customer name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter phone number"
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Amount (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="space-y-3 mt-6">
              <button
                onClick={testBackendConnection}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold text-white hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Testing...' : 'Test Backend Connection'}
              </button>

              <button
                onClick={testPromoValidation}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Testing...' : 'Test Promo Code (EARLYBIRD)'}
              </button>

              <button
                onClick={testCreateOrder}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-bold text-white hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Order...' : 'Step 1: Create Payment Order'}
              </button>

              {paymentSessionId && (
                <button
                  onClick={proceedToPayment}
                  disabled={!cashfreeLoaded}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold text-white hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
                >
                  {cashfreeLoaded ? '💳 Step 2: Proceed to Payment' : 'Loading Payment Gateway...'}
                </button>
              )}

              <button
                onClick={testCashfreeConfig}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-bold text-white hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Testing...' : 'Test Cashfree Configuration'}
              </button>
            </div>

            {/* Environment Info */}
            <div className="mt-6 p-4 bg-black/30 rounded-lg">
              <h3 className="text-sm font-semibold text-white/80 mb-2">Environment Info:</h3>
              <div className="text-xs text-white/60 space-y-1">
                <div>Backend URL: {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}</div>
                <div>Environment: {process.env.NODE_ENV || 'development'}</div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">Test Results</h2>

            {result ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-500/10 border-green-400/30 text-green-300' 
                    : 'bg-red-500/10 border-red-400/30 text-red-300'
                }`}>
                  <div className="font-semibold mb-2">
                    {result.type.toUpperCase()} - {result.success ? 'SUCCESS' : 'FAILED'}
                  </div>
                  <div className="text-sm opacity-80">
                    Status: {result.status}
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Response Data:</h3>
                  <pre className="text-sm text-white/70 overflow-auto max-h-96">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/50 py-8">
                <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Run a test to see results here</p>
              </div>
            )}

            {/* Test Guide */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <h3 className="text-blue-300 font-semibold mb-2">Testing Guide:</h3>
              <div className="text-sm text-blue-200 space-y-2">
                <div>1. First test backend connection</div>
                <div>2. Test promo code validation</div>
                <div>3. Test payment order creation</div>
                <div>4. Check console for detailed logs</div>
              </div>
            </div>

            {/* Available Promo Codes */}
            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg">
              <h3 className="text-purple-300 font-semibold mb-2">Available Promo Codes:</h3>
              <div className="text-sm text-purple-200 space-y-1">
                <div>• EARLYBIRD - 15% off (min ₹100)</div>
                <div>• STUDENT50 - ₹50 off (min ₹150)</div>
                <div>• WELCOME10 - 10% off (min ₹50)</div>
                <div>• FESTIVAL25 - 25% off (min ₹200)</div>
                <div>• COMBO20 - ₹20 off (min ₹100)</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-6"
        >
          <h3 className="text-yellow-300 font-semibold mb-3">Setup Instructions:</h3>
          <div className="text-sm text-yellow-200 space-y-2">
            <div>1. Make sure your backend server is running on the configured URL</div>
            <div>2. Ensure MongoDB is connected and seeded with test data</div>
            <div>3. Verify Cashfree credentials are set in your backend .env file</div>
            <div>4. Check that CORS is configured to allow your frontend domain</div>
            <div>5. For actual payment testing, you'll need to authenticate first (login)</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
