import React, { useState, useEffect } from 'react';
import { EventCatalogItem } from '../../../lib/eventCatalog';
import { CheckoutState } from '../types';
import { CreditCard, Loader, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import createApiUrl from '../../../lib/api';
import { load } from '@cashfreepayments/cashfree-js';
import { retryFetch } from '../utils';

interface PaymentStepProps {
  selectedEvents: EventCatalogItem[];
  state: CheckoutState;
  finalPrice: number;
  filesBySignature: Record<string, Record<string, File>>;
  memberFilesBySignature: Record<string, Record<number, File>>;
}

export function PaymentStep({
  selectedEvents,
  state,
  finalPrice,
  filesBySignature,
  memberFilesBySignature,
}: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const initiatePayment = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // Prepare registration data
      const registrationForm = new FormData();
      
      let userName = '';
      let userEmail = '';

      // Extract from first available form
      for (const [signature, data] of Object.entries(state.formDataBySignature)) {
        if (data.name) userName = data.name;
        if (data.collegeMailId) userEmail = data.collegeMailId;
        if (userName && userEmail) break;
      }

      // Fallback to visitor pass details
      if (!userName && state.visitorPassDetails.name) userName = state.visitorPassDetails.name;
      if (!userEmail && state.visitorPassDetails.collegeMailId) userEmail = state.visitorPassDetails.collegeMailId;

      // Generate a strong random password since checkout flow does not collect one
      const generatedPassword = Math.random().toString(36).slice(-10) + 'A1!';

      registrationForm.append('name', userName);
      registrationForm.append('email', userEmail);
      registrationForm.append('password', generatedPassword);

      // Also send flat fields if available from first form
      const firstFormData = Object.values(state.formDataBySignature)[0] || {};
      if (firstFormData['contactNo']) registrationForm.append('contactNo', firstFormData['contactNo']);
      if (firstFormData['gender']) registrationForm.append('gender', firstFormData['gender']);
      if (firstFormData['age']) registrationForm.append('age', firstFormData['age']);
      if (firstFormData['universityName']) registrationForm.append('universityName', firstFormData['universityName']);
      if (firstFormData['address']) registrationForm.append('address', firstFormData['address']);
      if (firstFormData['referralCode']) registrationForm.append('referralCode', firstFormData['referralCode']);

      // Send complex payloads for backend to persist
      registrationForm.append('formsBySignature', JSON.stringify(state.formDataBySignature));
      registrationForm.append('teamMembersBySignature', JSON.stringify(state.teamMembersBySignature));
      registrationForm.append('flagshipBenefitsByEvent', JSON.stringify(state.flagshipBenefitsByEvent || {}));
      registrationForm.append('items', JSON.stringify(selectedEvents.map(e => ({ id: e.id, title: e.title, price: e.price }))));

      registrationForm.append('visitorPassDays', state.visitorPassDays.toString());
      registrationForm.append('visitorPassDetails', JSON.stringify(state.visitorPassDetails));

      // Attach first available profile image
      for (const [signature, files] of Object.entries(filesBySignature)) {
        const firstFile = Object.values(files)[0];
        if (firstFile) {
          registrationForm.append('profileImage', firstFile);
          break;
        }
      }

      // Append team member images with deterministic keys: memberImage__<signature>__<index>
      Object.entries(memberFilesBySignature).forEach(([signature, idxMap]) => {
        Object.entries(idxMap).forEach(([idxStr, file]) => {
          const idx = Number(idxStr);
          const encodedSig = encodeURIComponent(signature);
          registrationForm.append(`memberImage__${encodedSig}__${idx}`, file);
          console.log('📤 Appending team member file:', `memberImage__${encodedSig}__${idx}`, file.name);
        });
      });

      // Register user
      const registerResponse = await retryFetch(createApiUrl('/register'), {
        method: 'POST',
        credentials: 'include',
        body: registrationForm,
      });

      if (!registerResponse.ok) {
        throw new Error('Failed to register user');
      }

      // Create payment order
      const orderData = {
        amount: finalPrice,
        currency: 'INR',
        customerEmail: userEmail,
        customerName: userName,
        customerPhone: firstFormData['contactNo'] || '',
        orderNote: `Sabrang 2025 - ${selectedEvents.map(e => e.title).join(', ')}${state.visitorPassDays > 0 ? ` + ${state.visitorPassDays} day visitor pass` : ''}`,
      };

      console.log('🚀 Creating payment order with data:', orderData);

      const response = await retryFetch(createApiUrl('/api/payments/create-order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const result = await response.json();
      console.log('✅ Payment order created:', result);

      // Extract session ID from response (it's nested in data object)
      const paymentData = result.data || result;
      const sessionId = paymentData.paymentSessionId || paymentData.payment_session_id || paymentData.sessionId || paymentData.session_id;
      
      if (!sessionId) {
        console.error('❌ No session ID in response. Full response:', result);
        console.error('❌ Payment data:', paymentData);
        throw new Error('Payment session ID not received from server');
      }

      console.log('✅ Got payment session ID:', sessionId);

      // Initialize Cashfree SDK
      console.log('💳 Initializing Cashfree SDK...');
      const cashfree = await load({ mode: 'production' });
      
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: '_self' as const,
      };

      console.log('💳 Launching Cashfree checkout with options:', checkoutOptions);
      await cashfree.checkout(checkoutOptions);
      
      setPaymentStatus('success');
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          <span className="text-cyan-400">Payment</span>
        </h2>
        <p className="text-gray-400 mb-6">Complete your payment to confirm registration</p>
      </div>

      {/* Payment Summary */}
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-purple-200">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Total Amount</span>
            <span className="text-3xl font-bold text-purple-400">
              ₹{finalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      {paymentStatus === 'processing' && (
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg flex items-center gap-4">
          <Loader className="w-6 h-6 animate-spin text-blue-400" />
          <div>
            <p className="font-semibold text-blue-400">Processing Payment</p>
            <p className="text-sm text-white/70">Please wait while we process your payment...</p>
          </div>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-green-400/40 shadow-lg flex items-center gap-4">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <div>
            <p className="font-semibold text-green-400">Payment Successful</p>
            <p className="text-sm text-white/70">Your registration is confirmed!</p>
          </div>
        </div>
      )}

      {paymentStatus === 'failed' && error && (
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <div className="flex items-center gap-4 mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
              <div>
                <p className="font-semibold text-red-400">Payment Failed</p>
                <p className="text-sm text-white/70">{error}</p>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-400/40 rounded-lg p-4">
              <p className="text-sm text-yellow-200 mb-3">
                <strong>Alternative Payment Option:</strong> You can also pay directly using this link:
              </p>
              <a
                href="https://payments.cashfree.com/forms?code=sabrang25"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Pay via Cashfree Link
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Payment Button */}
      {paymentStatus === 'idle' && (
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-white/70">
                <p className="font-semibold mb-2 text-purple-200">Before proceeding:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure all details are correct</li>
                  <li>Have your payment method ready</li>
                  <li>Do not refresh the page during payment</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={initiatePayment}
            disabled={isProcessing}
            className="w-full px-8 py-5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-all font-bold text-xl flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                Pay ₹{finalPrice.toFixed(2)}
              </>
            )}
          </button>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <button
          onClick={initiatePayment}
          disabled={isProcessing}
          className="w-full px-8 py-5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-all font-bold text-xl flex items-center justify-center gap-3 shadow-lg cursor-pointer"
        >
          <CreditCard className="w-6 h-6" />
          Retry Payment
        </button>
      )}
    </div>
  );
}
