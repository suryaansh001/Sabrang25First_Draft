"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit3, Trash2, Copy, Tag, Calendar, Users, CheckCircle, XCircle } from "lucide-react";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import createApiUrl from "../../../lib/api";

interface PromoCode {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  description: string;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/promo-codes', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data);
      }
    } catch (error) {
      console.error('Failed to fetch promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePromoCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/admin/promo-codes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setPromoCodes(promoCodes.filter(code => code._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete promo code:', error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const formatDiscount = (code: PromoCode) => {
    if (code.discountType === 'percentage') {
      return `${code.discountValue}%${code.maxDiscountAmount ? ` (max ₹${code.maxDiscountAmount})` : ''}`;
    }
    return `₹${code.discountValue}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Loading promo codes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Promo Codes Management</h1>
              <p className="text-gray-300">Create and manage discount codes</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Create Promo Code</span>
            </button>
            
            <Link href="/admin/bulk-promo" className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              <Tag className="w-5 h-5" />
              <span>Bulk Create</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Tag className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{promoCodes.length}</p>
                <p className="text-sm text-gray-300">Total Codes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{promoCodes.filter(code => code.isActive).length}</p>
                <p className="text-sm text-gray-300">Active Codes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold">{promoCodes.reduce((sum, code) => sum + code.usedCount, 0)}</p>
                <p className="text-sm text-gray-300">Total Uses</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">
                  {promoCodes.filter(code => new Date(code.validUntil) > new Date()).length}
                </p>
                <p className="text-sm text-gray-300">Valid Codes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Codes Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Usage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Valid Until</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {promoCodes.map((code) => (
                  <tr key={code._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-lg">{code.code}</span>
                        <button
                          onClick={() => copyToClipboard(code.code)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Copy code"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-400">{code.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">{formatDiscount(code)}</span>
                      {code.minOrderAmount > 0 && (
                        <p className="text-sm text-gray-400">Min: ₹{code.minOrderAmount}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-semibold">{code.usedCount}</span>
                        <span className="text-gray-400"> / {code.usageLimit}</span>
                      </div>
                      <div className="w-20 bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(code.usedCount / code.usageLimit) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">
                        {new Date(code.validUntil).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {code.isActive ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={`text-sm ${code.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          {code.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingCode(code)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit promo code"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePromoCode(code._id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                          title="Delete promo code"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {promoCodes.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Promo Codes Found</h3>
            <p className="text-gray-400 mb-6">Create your first promo code to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Create Promo Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProtectedPromoCodesPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <PromoCodesPage />
    </ProtectedRoute>
  );
}
